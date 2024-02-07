/* eslint-disable no-unused-vars */

import { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import P from 'prop-types';
import { isMobile } from 'react-device-detect';

// import { socket } from '@/services/socket';
// import { useContextAuth } from '@/hooks';

import * as MDP from './styles.module.css';

const PRESSED_BREAK = 0.09; //90 ms
const TIMEOUT_DISABLED = 1000 * 60; //1min

const MenuDevicePhysical = ({ device, onUpdateStatus }) => {

  const intervalPressed = useRef(null);
  const timeoutRef = useRef(null);
  // const { person } = useContextAuth();
  const [currentState, setCurrentState] = useState({
    isDisabled: false,
    isFirstUse: true,
    canDrag: isMobile ? false : true
  });
  const [refDevice, setRefDevice] = useState(null);

  const attachRef = (el) => {
    drag(el);
    setRefDevice(el);
  }

  const handleTouchStart = () => {
    intervalPressed.current = setTimeout(() => {
      setCurrentState(prevState => ({
        ...prevState,
        canDrag: !currentState.isDisabled ? true : false
      }))
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
    setCurrentState(prevState => ({
      ...prevState,
      isDisabled: true,
      isFirstUse: false,
      canDrag: false
    }))

    //ENVIAR MENSAGEM AO BACKEND PARA O SENSOR ENTRAR EM WATCHDOG

    // socket.emit('sensor/update/activation', {
    //   id: person.id,
    //   mac: device.id,
    //   active: false
    // });
  }

  const handleMovementInMoutingPanel = () => {
    let newState = { canDrag: false }

    if(currentState.isFirstUse){
      newState = {
        ...newState,
        isFirstUse: false
      }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCurrentState(prevState => ({
      ...prevState,
      ...newState
    }));

    onUpdateStatus({
      id: device.id,
      inUse: true
    });

  }

  const [_, drag] = useDrag(() => ({
    type: 'menu-device',
    item: {
      ...device,
      draggedDevice: refDevice
    },
    canDrag: () => currentState.canDrag,
    end: () => handleMovementInMoutingPanel()
  }), [ refDevice, device.inUse, currentState, timeoutRef.current]);

  useEffect(() => {
    timeoutRef.current = setTimeout(handleDisabling, TIMEOUT_DISABLED);

    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {

    if(!currentState.isFirstUse && !device.inUse){
      setCurrentState(prevState => ({
        ...prevState,
        isDisabled: true,
        canDrag: false
      }))
    }
  }, [device.inUse]);

  return (
    <li
      className={MDP.deviceItemContainer}
      data-disabled={currentState.isDisabled}
      data-inuse={device.inUse}
      title={currentState.isDisabled ?
        'Pressione o botão de restart do hardware para ativar o dispositivo na tela':
        `Dispositivo físico ${device.label}`
      }
    >
      <div
        className={MDP.deviceItemContent}
        ref={attachRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={device.imgSrc}
          alt={device.name}
          loading='lazy'
        />
      </div>
      <p className={MDP.deviceItemLabel}>{device.label}</p>
    </li>
  );
};

MenuDevicePhysical.propTypes = {
  device: P.shape({
    id: P.oneOfType([
      P.string,
      P.number
    ]).isRequired,
    name: P.string.isRequired,
    label: P.string.isRequired,
    imgSrc: P.string.isRequired,
    type: P.string.isRequired,
    category: P.string.isRequired,
    inUse: P.bool.isRequired
  }),
  onUpdateStatus: P.func.isRequired
}

export default MenuDevicePhysical;
