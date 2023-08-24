
import { memo, useState } from 'react';
import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';


import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/Device/SharedDevice/ActionButtons/ActionButton';
import ConnectorsConnector from '@/components/Platform/Device/SharedDevice/Connectors/ConnectorsConnector';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerRight,
  connectorsContainer,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  ledLight,
  ledLightElement,
  lights
} from './styles.module.css';

const Bargraph = memo(function Bargraph({
  dragRef, device, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const [lightsActive, setLightsActive] = useState(0);

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

      const stepValue = max / 8;
      let numberLights = 8;

      for (let i = 0; i < 9; i++) {
        if (stepValue * i > current) {
          numberLights--;
        }
      }

      setLightsActive(numberLights);

      updateValue(setValue, id, {
        ...objValue,
        active: true,
      });

    } else {
      //disable light
      updateValue(setValue, id, {
        ...objValue,
        active: false,
        opacity: 0,
      });
    }
  }

  const redefineBehavior = () => {
    setLightsActive(0),
      updateValue(setValue, id, {
        active: false,
        current: 0,
        max: 0,
        type: null,
        brightness: 1023
      });
  }

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <ul className={lights}>
          <li className={ledLight}>
            {lightsActive > 0 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 1 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 2 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 3 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 4 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 5 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 6 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
          <li className={ledLight}>
            {lightsActive > 7 && (
              <svg className={ledLightElement}>
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
          </li>
        </ul>
        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>
      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <ConnectorsConnector
          name={'light'}
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
          <Trash />
        </ActionButton>
      </div >
    </>
  );
});

Bargraph.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  updateValue: P.func.isRequired
}

export default Bargraph;
