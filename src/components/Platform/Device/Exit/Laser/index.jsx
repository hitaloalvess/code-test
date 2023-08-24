import { memo, useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButtons/ActionButton';
import Connector from '@/components/Platform/Connector';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerRight,
  connectorsContainer,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  laserLight,
  laserLightElement
} from './styles.module.css';

const Laser = memo(function Laser({
  dragRef, device, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);

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
        <div className={laserLight}>
          {value.active && (
            <svg className={laserLightElement} style={{ fillOpacity: `${value.opacity}` }} viewBox="0 0 243 131"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M39.3808 16.1655L127.972 59.171L130.467 62.1185C137.247 70.1275 131.51 82.4001 121.017 82.3354L26.0204 32.3048L39.3808 16.1655Z"
                fill="#C62626" />
              <path
                d="M39.3922 28C42.1144 24.5 45.8922 14.5 36.8922 11C29.8922 12 19.8922 22.5 22.3921 33.5C25.3921 36 34.0224 34.904 39.3922 28Z"
                fill="#C62626" />
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
              disableModal('confirmation');
            }
          })}
        >
          <Trash />
        </ActionButton>
      </div >
    </>
  );
});

Laser.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  updateValue: P.func.isRequired
}

export default Laser;
