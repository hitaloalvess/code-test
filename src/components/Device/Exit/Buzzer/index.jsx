
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

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
  dragRef, device
}) {
  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [, setValue] = useState({
    current: 0,
    max: 0,
    type: null
  });

  const [audio] = useState(new Audio(buzzerAudio));
  const [duration, setDuration] = useState(4);
  const [volume, setVolume] = useState(50);
  const [soundActive, setSoundActive] = useState(false);
  const timeoutStopAudio = useRef(null);

  const enableSound = () => {
    audio.load();
    audio.volume = volume * 0.01;
    audio.loop = true;
    audio.play();

    timeoutStopAudio.current = setTimeout(() => disableSound(), duration * 1000);
  };

  const disableSound = () => {
    audio.pause();
    audio.loop = false;
    setSoundActive(false);

    clearTimeout(timeoutStopAudio.current);
  }

  useEffect(() => {
    if (soundActive) {
      enableSound();
    }
    else
    {
      disableSound();
    }
  }, [soundActive]);


  const handleSettingUpdate = useCallback((newDuration, newVolume) => {
    if (newDuration !== duration) {
      setDuration(newDuration);
    }

    if (newVolume !== volume) {
      setVolume(newVolume);
    }

    disableSound();
  }, [duration, volume]);

  const defaultBehavior = (valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      value: typeof value === 'boolean' ?
        (value ? 1023 : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value
    }

    if (objValue?.value !== 0) {
      setSoundActive(true);
    }
    setValue(objValue);
  }

  const redefineBehavior = () => {
      setSoundActive(false),
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
        <svg
          className={soundActive ? buzzerIconOn : buzzerIconOff}
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
        <Connector
          name={'boolean'}
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

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-buzzer',
            handleSaveConfig: handleSettingUpdate,
            defaultDuration: duration,
            defaultVolume: volume
          })}
        >
          <AiFillSetting />
        </ActionButton>
      </div >
    </>
  );
});

Buzzer.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired
}

export default Buzzer;
