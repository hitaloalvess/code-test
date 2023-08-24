
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Trash, Gear } from '@phosphor-icons/react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButtons/ActionButton';
import ConnectorsConnector from '@/components/Platform/Connectors/ConnectorsConnector';

import buzzerAudio from '@/assets/audio/audio-buzzer.mp3';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerRight,
  connectorsContainer,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  buzzerIconOff,
  buzzerIconOn
} from './styles.module.css';

const Buzzer = memo(function Buzzer({
  dragRef, device, updateValue
}) {
  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [audio] = useState(new Audio(buzzerAudio));
  const [value, setValue] = useState(device.value);
  const [valueTemp, setValueTemp] = useState({
    active: false,
    current: 0,
    max: 0,
    type: null
  });

  const timeoutStopAudio = useRef(null);

  const enableSound = () => {
    audio.loop = true;
    audio.play();
  };

  const disableSound = () => {
    audio.pause();
    audio.loop = false;

    setValueTemp({
      ...valueTemp,
      active: false
    })

    clearTimeout(timeoutStopAudio.current);
  }

  const handleSettingUpdate = useCallback((newDuration, newVolume) => {

    updateValue(setValue, id, {
      ...value,
      duration: newDuration,
      volume: newVolume
    });

  }, [value.duration, value.volume]);

  const defaultBehavior = (valueReceived) => {
    const { value: newValue, max } = valueReceived;

    const objValue = {
      current: typeof newValue === 'boolean' ?
        (newValue ? 1023 : 0) : newValue,
      max: typeof newValue === 'boolean' ? 1023 : max,
      type: typeof newValue
    }

    setValueTemp({
      ...objValue,
      active: objValue.current !== 0
    })
  };

  const redefineBehavior = () => {

    updateValue(setValue, id, {
      ...device.value
    });

    setValueTemp({
      active: false,
      current: 0,
      max: 0,
      type: null
    })
  }


  useEffect(() => {


    const { current, max, type } = valueTemp;
    if (valueTemp.active) {

      updateValue(setValue, id, {
        ...value,
        current, max, type,
        active: true
      });

      enableSound();

      timeoutStopAudio.current = setTimeout(() => disableSound(), value.duration * 1000);

    }
    else {
      updateValue(setValue, id, {
        ...value,
        current, max, type,
        active: false
      });

      disableSound();

    }
  }, [valueTemp.active]);


  useEffect(() => {

    const { current, max, type } = valueTemp;

    audio.volume = value.volume;

    updateValue(setValue, id, {
      ...value,
      current, max, type,
      active: false
    });

    disableSound();

  }, [value.volume, value.duration]);

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <svg
          className={valueTemp.active ? buzzerIconOn : buzzerIconOff}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.4961 0.241341C19.8125 0.475691 20 0.850652 20 1.24514V4.05734V14.3688C20 16.0951 18.3203 17.4934 16.25 17.4934C14.1797 17.4934 12.5 16.0951 12.5 14.3688C12.5 12.6424 14.1797 11.2441 16.25 11.2441C16.6875 11.2441 17.1094 11.3066 17.5 11.4238V5.73686L7.5 8.73654V16.8685C7.5 18.5949 5.82031 19.9932 3.75 19.9932C1.67969 19.9932 0 18.5949 0 16.8685C0 15.1421 1.67969 13.7438 3.75 13.7438C4.1875 13.7438 4.60938 13.8063 5 13.9235V7.80695V4.99475C5 4.44402 5.36328 3.95579 5.89063 3.79565L18.3906 0.0460493C18.7695 -0.06722 19.1797 0.00308507 19.4961 0.241341Z"
            fill="#282832"
          />
        </svg>

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
          name={'boolean'}
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

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-buzzer',
            handleSaveConfig: handleSettingUpdate,
            defaultDuration: value.duration,
            defaultVolume: value.volume
          })}
        >
          <Gear />
        </ActionButton>
      </div >
    </>
  );
});

Buzzer.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  updateValue: P.func.isRequired
}

export default Buzzer;
