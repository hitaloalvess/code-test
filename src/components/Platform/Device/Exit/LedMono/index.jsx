
import { memo, useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import P from 'prop-types';

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
  ledLightElement
} from './styles.module.css';

const LedMono = memo(function Led({
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
        <div className={ledLight}>
          {value.active && (
            <svg className={ledLightElement} style={{ fillOpacity: `${value.opacity * 0.5}` }} viewBox="0 0 143 143"
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
        <ConnectorsConnector
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

LedMono.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  updateValue: P.func.isRequired
}

export default LedMono;
