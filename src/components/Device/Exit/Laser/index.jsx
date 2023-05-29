
import { memo, useState } from 'react';
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
  laserLight,
  laserLightElement
} from './styles.module.css';

const Laser = memo(function Laser({
  dragRef, device
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [lightActive, setLightActive] = useState(false);
  const [, setValue] = useState({
    current: 0,
    max: 0,
    type: null
  });
  const [brightness, setBrightness] = useState(0);
  const [opacity, setOpacity] = useState(0);


  const enableLight = ({ brightness, maxValue }) => {
    const opacity = brightness / maxValue;

    setOpacity(opacity);
    setLightActive(true);
  }

  const disableLight = () => {
    setOpacity(0);
    setLightActive(false);
  }


  const defaultBehavior = (valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      value: typeof value === 'boolean' ? brightness : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value
    }

    if (objValue?.value !== 0) {
      const { value, max } = objValue;
      const brigthnessValue = objValue.value < 0 ? value * -1 : value;

      enableLight({
        brightness: brigthnessValue,
        maxValue: max
      });

    } else {
      disableLight();
    }

    setValue(objValue);
  }

  const redefineBehavior = () => {
    setBrightness(0);
    setOpacity(0);
    setValue({
      current: 0,
      max: 0,
      type: null
    })
  }

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <div className={laserLight}>
          {lightActive && (
            <svg className={laserLightElement} style={{ fillOpacity: `${opacity}` }} viewBox="0 0 243 131"
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
            redefineBehavior
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
      </div >
    </>
  );
});

Laser.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired
}

export default Laser;
