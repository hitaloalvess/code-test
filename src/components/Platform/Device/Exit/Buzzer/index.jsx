
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import BuzzerIcon from './BuzzerIcon';

import buzzerAudio from '@/assets/audio/audio-buzzer.mp3';


const Buzzer = memo(function Buzzer({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
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
    containerRef
  } = data;
  const { updateDeviceValue } = useDevices();
  const { updateDeviceValueInFlow } = useFlow();

  const [audio] = useState(new Audio(buzzerAudio));


  const handleEnableSound = () => {
    audio.loop = true;
    audio.play();
  };

  const handleDisableSound = () => {
    audio.pause();
    audio.loop = false;

    // setValueTemp({
    //   ...valueTemp,
    //   active: false
    // })

    const newValue = {
      ...value,
      active: false
    }

    clearTimeout(timeoutStopAudio.current);

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

  }

  const handleSettingUpdate = useCallback((newDuration, newVolume) => {

    // updateValue(setValue, id, {
    //   ...value,
    //   duration: newDuration,
    //   volume: newVolume
    // });
    audio.volume = newVolume;

    const newValue = {
      ...value,
      duration: newDuration,
      volume: newVolume
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

  }, [value.duration, value.volume]);

  const defaultBehavior = useCallback((valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      current: typeof value === 'boolean' ?
        (value ? 1023 : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value
    }

    // setValueTemp({
    //   ...objValue,
    //   active: objValue.current !== 0
    // })
    const newValue = {
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
      type: null
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

    updateDeviceValue(id, {
      defaultBehavior,
      redefineBehavior
    })
  }, [defaultBehavior, redefineBehavior]);

  return (
    <>


      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

        <BuzzerIcon active={value.active} />

        <ActionButtons
          orientation='right'
          active={activeActBtns}
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
            data: connectors.frequency,
            device: {
              id,
              defaultBehavior,
              redefineBehavior,
              containerRef: containerRef
            },
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
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Buzzer;
