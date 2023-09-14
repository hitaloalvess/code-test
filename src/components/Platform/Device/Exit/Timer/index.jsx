
import { memo, useCallback, useRef, useState, useEffect } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import * as T from './styles.module.css';

const Timer = memo(function ShakeMotor({
  data, dragRef, onSaveData
}) {
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

     const [timeInterval, setTimeInterval] = useState(0);
     const [isResetEnable, setIsResetEnable] = useState(0);
     const [isTimerEnable,setIsTimerEnable ] = useState(0);
     const setIntervalRef = useRef(null);

  const handleResetConnector = (valueReceived) => {
    const { value: newValue } = valueReceived;

    const objValue = {
      ...value,
      current: typeof newValue === 'boolean' ?
      newValue : (newValue == 0 ? false : true),
      type: typeof newValue,
    }

    setIsResetEnable(objValue?.current);
  }

  const defaultReceiveBehavior = useCallback((valueReceived) => {
    const { value: newValue } = valueReceived;

    console.log (connectors.active);

    const objValue = {
      ...value,
      current: typeof newValue === 'boolean' ?
      newValue : (newValue == 0 ? false : true),
      type: typeof newValue,
    }

    if (objValue?.current)
      setIsTimerEnable(true);
    else
      setIsTimerEnable(false);

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.active.id, newValue })

  }, [connectors])


  const enableTimer = () => {
    clearInterval(setIntervalRef.current);
    setIntervalRef.current = setInterval(() => {
      setTimeInterval(prevTime => prevTime + 1);
    }, 1000);
  }

  const  disableTimer = () => {
    if (isResetEnable)
      setTimeInterval(0);
    clearInterval(setIntervalRef.current);
  }

  const redefineBehavior = () => {
    clearInterval(setIntervalRef.current);
  }

  useEffect(() => {
    if (isTimerEnable)
      enableTimer();
    else
      disableTimer();
  }, [isTimerEnable, isResetEnable]);

  return (
    <>
      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >

        <p className={T.timerNumber}>
          {timeInterval}
        </p>

        <ActionButtons
          orientation='bottom'
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
        />
      </DeviceBody>

      <Connectors
        type='entrys'
        exitConnectors={[
          {
            data: {
              ...connectors.active,
              defaultReceiveBehavior,
              redefineBehavior
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
          {
            data: {
              ...connectors.reset,
              defaultReceiveBehavior: handleResetConnector,
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

Timer.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Timer;
