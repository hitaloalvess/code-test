
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
  ledLight,
  ledLightElement
} from './styles.module.css';

const LedMono = memo(function Led({
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
        <div className={ledLight}>
          {lightActive && (
            <svg className={ledLightElement} style={{ fillOpacity: `${opacity * 0.5}` }} viewBox="0 0 143 143"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M32.273 62.4038C32.1137 43.8898 46.8756 33.7997 61.6353 33.1042C77.2726 32.3675 92.884 43.8334 92.8871 62.1665C92.8931 105.403 93.6193 113.977 92.9704 122.874C84.96 141.895 37.3388 138.956 32.2677 123.39C31.4452 118.404 32.273 62.4038 32.273 62.4038Z"
                fill="white" />
              <path d="M132.899 71.5C132.899 90.5 115.967 128.5 72.035 128.5C28.1032 128.5 -7.60137 91.5 1.39863 51.5001C10.3986 11.5002 42.8986 0.000132132 72.035 7.60076e-10C122.899 -0.000230663 132.899 52.5 132.899 71.5Z"
                fill="white" />
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

LedMono.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired
}

export default LedMono;
