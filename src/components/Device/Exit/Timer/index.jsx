
import { memo, useState, useEffect, useRef } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import Connector from '@/components/Connector';
import ActionButton from '@/components/ActionButton';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerBottom,
  connectorsContainer,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  timerNumber,
  resetLight,
  resetLightElement
} from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/exit/timerBase.svg';


const Timer = memo(function Led({
  dragRef, device
}) {

  const { id, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();
  const [timeInterval, setTimeInterval] = useState(0);
  const [isResetEnable, setIsResetEnable] = useState(0);
  const [isTimerEnable,setIsTimerEnable ] = useState(0);
  const setIntervalRef = useRef(null);
  const [value, setValue] = useState(device.value);

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

  const defaultBehavior = (valueReceived) => {
    const { value: newValue } = valueReceived;

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

  }

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
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <img
          src={eventBaseImg}
          alt={`Device ${name}`}
          loading='lazy'
        />
        <p className={timerNumber}>
          {timeInterval}
        </p>
        <li className={resetLight}>
        {isResetEnable ? (
            <svg className={resetLightElement}>
                <circle cx="3" cy="3" r="3" fill='red'/>
            </svg>
          ) : ''}
        </li>
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'value'}
          type={'entry'}
          device={{
            id,
            defaultBehavior,
            redefineBehavior,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />

        <Connector
          name={'reset'}
          type={'entry'}
          device={{
            id,
            defaultBehavior: handleResetConnector,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />
      </div>

      <div
        className={
          `${actionButtonsContainer} ${actionButtonsContainerBottom}`
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


Timer.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Timer;
