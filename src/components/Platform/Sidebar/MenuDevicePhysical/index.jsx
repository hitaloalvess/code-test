/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import P from 'prop-types';
import { Repeat, TrashSimple } from '@phosphor-icons/react'

import { disconnectHardware, updateHardwareEvents } from '@/api/socket/hardware';
import { createHardwareConnection } from '@/api/http';
import { useSidebar, useContextAuth, useModal } from '@/hooks';

import ButtonMenuDevicePhysical from '../ButtonMenuDevicePhysical'

import * as MDP from './styles.module.css';

const PRESSED_BREAK = 0.09; //90 ms
const TIMEOUT_DISABLED = 1000 * 60; //1min

const MenuDevicePhysical = ({ device }) => {

  const intervalPressed = useRef(null);
  const timeoutRef = useRef(null);
  const isFirstRender = useRef(true);

  const { person } = useContextAuth();
  const { enableModal, disableModal } = useModal();
  const {
    handleChangePhysicalDeviceInSidebar,
    handleDeletePhysicalDevice,
  } = useSidebar();

  const [refDevice, setRefDevice] = useState(null);

  const attachRef = (el) => {
    drag(el);
    setRefDevice(el);
  }

  const handleTouchStart = () => {
    intervalPressed.current = setTimeout(() => {
      handleChangePhysicalDeviceInSidebar({
        device: {
          id: device.id,
          canDrag: !device.isDisabled ? true : false
        }
      })
    }, PRESSED_BREAK * 1000);
  }

  const handleTouchMove = () => {
    clearTimeout(intervalPressed.current);
    intervalPressed.current = null;
  }

  const handleTouchEnd = () => {
    clearTimeout(intervalPressed.current);
    intervalPressed.current = null;
  }

  const handleDisabling = () => {
    handleChangePhysicalDeviceInSidebar({
      device: {
        id: device.id,
        isDisabled: true,
        isFirstUse: false,
        canDrag: false
      }
    })

    disconnectHardware({ mac: device.mac, userId: person.id })
  }

  const handleDropOnMoutingPanel = ({ isValidDrop }) => {
    if (!isValidDrop) return;

    let newState = { canDrag: false, isFirstUse: device.isFirstUse }

    if (device.isFirstUse) {
      newState = {
        ...newState,
        isFirstUse: false
      }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    handleChangePhysicalDeviceInSidebar({
      device: {
        id: device.id,
        inUse: true,
        ...newState
      }
    });

    updateHardwareEvents({
      mac: device.mac,
      userId: person.id,
      events: {
        dashboard: true,
        isFirstUseInterval: newState.isFirstUse
      }
    })

  }

  const handleReconnection = () => {
    enableModal({
      typeContent: 'connect-physical-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      data: {
        mac: device.mac
      },
      handleConfirm: async ({ mac }) => {
        await createHardwareConnection({ mac, userId: person.id });
        handleChangePhysicalDeviceInSidebar({
          device: {
            id: device.mac,
            inUse: false,
            isDisabled: false,
            canDrag: true
          }
        })

        disableModal('connect-physical-device');
      }
    })
  }

  const handleDelete = () => enableModal({
    typeContent: 'confirmation',
    title: 'Deletar conexão',
    subtitle: 'Deseja mesmo deletar a conexão com o hardware?',
    handleConfirm: () => {
      handleDeletePhysicalDevice(device.id)
      disableModal('confirmation');
    }
  })

  const [_, drag] = useDrag(() => ({
    type: 'menu-device',
    item: {
      ...device,
      draggedDevice: refDevice,
      enablePhysicalDeviceInSidebar: () => handleChangePhysicalDeviceInSidebar({
        device: {
          id: device.mac,
          inUse: false,
          isDisabled: true,
          canDrag: false
        }

      })
    },
    canDrag: () => device.canDrag,
    end: (_, monitor) => {
      handleDropOnMoutingPanel({
        isValidDrop: monitor.didDrop()
      })
    }
  }), [refDevice, device.inUse, device, timeoutRef.current]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    timeoutRef.current = setTimeout(handleDisabling, TIMEOUT_DISABLED);

    const handleBeforeUnload = () => disconnectHardware({ mac: device.mac, userId: person.id })
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {

      clearTimeout(timeoutRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  return (
    <>
      <li
        className={MDP.deviceItemContainer}
        data-inuse={device.inUse}
        title={device.isDisabled ?
          'Pressione o botão de restart do hardware para ativar o dispositivo na tela' :
          `Dispositivo físico ${device.label}`
        }
      >
        <div
          className={MDP.deviceItemContent}
          ref={attachRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          data-disabled={device.isDisabled}
        >
          <img
            src={device.imgSrc}
            alt={device.name}
            loading='lazy'
          />
        </div>
        <p className={MDP.deviceItemLabel}>{device.mac}</p>

        <div className={MDP.deviceItemActionsContainer}>
          {device.isDisabled &&
            <ButtonMenuDevicePhysical
              handleClick={handleReconnection}
              title='Botão de reconexão com hardware'
              data-btn-type='reconnection'
            >
              <Repeat />
            </ButtonMenuDevicePhysical>
          }
          <ButtonMenuDevicePhysical
            handleClick={handleDelete}
            title='Botão de deletar conexão com hardware'
            data-btn-type='delete'
          >
            <TrashSimple />
          </ButtonMenuDevicePhysical>
        </div>

      </li>
    </>
  );
};

MenuDevicePhysical.propTypes = {
  device: P.shape({
    id: P.oneOfType([
      P.string,
      P.number
    ]).isRequired,
    mac: P.string.isRequired,
    name: P.string.isRequired,
    label: P.string.isRequired,
    imgSrc: P.string.isRequired,
    type: P.string.isRequired,
    category: P.string.isRequired,
    inUse: P.bool.isRequired,
    isDisabled: P.bool.isRequired,
    isFirstUse: P.bool.isRequired,
    canDrag: P.bool.isRequired
  }),
}

export default MenuDevicePhysical;
