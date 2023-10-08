
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import BuzzerIcon from './BuzzerIcon';

import buzzerAudio from '@/assets/audio/audio-buzzer.mp3';


const Buzzer = memo(function Buzzer({
  data, dragRef, onSaveData
}) {

  const isFirstRender = useRef(true);
  const timeoutStopAudio = useRef(null);

  const {
    id,
    imgSrc,
    name,
    posX,
    posY,
    value,
    connectors,
  } = data;

  const {
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [audio] = useState(new Audio(buzzerAudio));


  const handleEnableSound = () => {
    audio.loop = true;
    audio.autoplay = true;
    audio.play();
  };

  const handleDisableSound = () => {
    audio.pause();
    audio.loop = false;

    const newValue = {
      ...value,
      active: false
    }

    clearTimeout(timeoutStopAudio.current);

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

  }

  const handleSettingUpdate = useCallback((newDuration, newVolume) => {

    audio.volume = newVolume;

    const newValue = {
      ...value,
      duration: newDuration,
      volume: newVolume
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

  }, [value.duration, value.volume]);

  const defaultReceiveBehavior = useCallback((valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      current: typeof value === 'boolean' ?
        (value ? 1023 : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value
    }

    const newValue = {
      ...data.value,
      ...objValue,
      active: objValue.current !== 0
    }

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.frequency.id, newValue })

  }, [connectors]);

  const redefineBehavior = useCallback(() => {

    const value = {
      active: false,
      current: 0,
      max: 0,
      type: null,
      duration: 4,
      volume: 0.5,
    }

    onSaveData('value', value)

    updateDeviceValue(id, { value });

  }, []);


  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (value.active) {
      handleEnableSound();
      timeoutStopAudio.current = setTimeout(() => handleDisableSound(), value.duration * 1000);

      return;
    }

    handleDisableSound();

  }, [value.active]);

  useEffect(() => {

    return () => {
      audio.pause();
      clearTimeout(timeoutStopAudio.current);
    }
  }, [])


  return (
    <>


      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >

        <BuzzerIcon active={value.active} />

        <ActionButtons
          orientation='right'
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            typeContent: 'config-buzzer',
            onSave: handleSettingUpdate,
            data: {
              defaultDuration: value.duration,
              defaultVolume: value.volume
            }
          }}
        />
      </DeviceBody>

      <Connectors
        type='entrys'
        exitConnectors={[
          {
            data: {
              ...connectors.frequency,
              defaultReceiveBehavior,
              redefineBehavior
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
      />


    </>
  );
});

Buzzer.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Buzzer;
