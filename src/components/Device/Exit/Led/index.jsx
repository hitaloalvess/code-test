
import { memo, useCallback, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerRight,
  connectorsContainer,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  ledLight,
  ledLightElement
} from './styles.module.css';

const Led = memo(function Led({
  device, dragRef, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);

  const handleSettingUpdate = useCallback((newColor, newBrightness) => {

    updateValue(setValue, id, {
      ...value,
      color: newColor,
      brightness: newBrightness
    })
  }, [value.color, value.brightness]);

  const defaultBehavior = (valueReceived) => {
    const { value: newValue, max } = valueReceived;

    const objValue = {
      ...value,
      current: typeof newValue === 'boolean' ?
        (newValue ? value.brightness : 0) : newValue,
      max: typeof newValue === 'boolean' ? 1023 : max,
      type: typeof newValue,
    }

    if (objValue?.current !== 0) {
      //enable light
      const { current, max } = objValue;
      const brigthnessValue = current < 0 ? current * -1 : current;

      updateValue(setValue, id, {
        ...objValue,
        active: true,
        opacity: brigthnessValue / max
      });

    } else {
      //disable light
      updateValue(setValue, id, {
        ...objValue,
        opacity: 0,
        active: false
      });
    }

  }

  const redefineBehavior = () => {
    updateValue(setValue, id, {
      active: false,
      current: 0,
      max: 0,
      type: null,
      color: '#ff1450',
      opacity: 0,
      brightness: 1023
    });

  }

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <div className={ledLight}>
          {value.active && (
            <svg className={ledLightElement} style={{ fill: `${value.color}`, fillOpacity: `${value.opacity}` }} viewBox="0 0 51 74"
              xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="25.5" cy="68" rx="7.6" ry="4.1" />
              <path
                d="M25 62.5L1.5 23.8L3 26L3.60233 26.85L4.80116 28.1L6 29.2L7.75 30.5L9.5 31.65L11.25 32.5L13 33.28L14.75 33.9L16.5 34.43L18.5 34.86L19.75 35.12L21 35.2557L23 35.43L25 35.5L26.75 35.45L28.5 35.34L30.25 35.12L32 34.82L34.5 34.25L37 33.47L40 32.2L42 31.1L43 30.43L44 29.72L45.5 28.5L47 26.87L25 62.5Z" />
              <path
                d="M50.5 18C50.5 27.9411 38.8071 35.5 25 35.5C11.1929 35.5 0 27.4411 0 17.5C0 7.55887 11.6929 0 25.5 0C39.3071 0 50.5 8.05887 50.5 18Z" />
            </svg>
          )}
        </div>
        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>
      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'brightness'}
          type={'entry'}
          device={{
            id,
            defaultBehavior,
            redefineBehavior,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />
      </div>

      <div
        className={
          `${actionButtonsContainer} ${actionButtonsContainerRight}`
        }
      >
        <ActionButton
          onClick={() => enableModal({
            typeContent: 'confirmation',
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            handleConfirm: () => {
              deleteDeviceConnections(id);
              deleteDevice(id);
              disableModal();
            }
          })}
        >
          <FaTrashAlt />
        </ActionButton>

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-led',
            handleSaveConfig: handleSettingUpdate,
            defaultColor: value.color,
            defaultBrightness: value.brightness
          })}
        >
          <AiFillSetting />
        </ActionButton>
      </div >
    </>
  );
});

Led.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Led;
