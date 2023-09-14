import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import Connector from '@/components/Connector';
import ActionButton from '@/components/ActionButton';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerBottom,
  connectorsContainer,
  connectorsContainerExit,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  delayNumber
} from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';
import { AiFillSetting } from 'react-icons/ai';

const INITIAL_DURATION = 5;
const Delay = ({
  dragRef, device, updateValue
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const [connectionValue, setConnectionValue] = useState([]);
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0)
  const [duration, setDuration] = useState(INITIAL_DURATION);
  const [timeInterval, setTimeInterval] = useState(INITIAL_DURATION);
  const setIntervalRef = useRef(null);
  const timeout = useRef(null);

  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleSettingUpdate = useCallback((newDuration) => {
    setDuration(newDuration);
  }, [duration]);

  const restartTimer = () => {
    setTimeInterval(duration);
    clearInterval(setIntervalRef.current);
    clearTimeout(timeout.current);
  }

  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, { value: 0, max: 0 });

      return;
    }

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!connection) return;

    const device = devices.find(device => device.id === connection.deviceFrom.id);

    let value = device.value.current;
    let max = 0;

    if ([undefined, null].includes(value)) {
      //If device.value.current undefined or null, structure equal boolean (true or false) or object -> ex: {temperature:{..}, humidity:{...}
      value = typeof device.value === 'boolean' ? device.value : device.value[connection.deviceFrom.connector.name]?.current
      max = typeof device.value === 'boolean' ? device.value : device.value[connection.deviceFrom.connector.name]?.max
    }

    const objValue = {
      idConnection: connection.id,
      value,
      max
    }

    setConnectionValue(objValue);
  }

  const calcValues = () => {
    if (!Object.hasOwn(connectionValue, 'idConnection')) {
      updateValue(setValue, id, { current: 0, max: 0 });

      return;
    }

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    if (connOutput.length <= 0) return;

    restartTimer();

    setIntervalRef.current = setInterval(() => {
      setTimeInterval(prevTime => prevTime - 1);
    }, 1000);

    timeout.current = setTimeout(() => {
      setValue(connectionValue.value)

      updateValue(setValue, id, { current: connectionValue.value, max: connectionValue.max });

      restartTimer();
    }, duration * 1000);
  }

  const sendValue = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      conn.deviceTo.defaultBehavior({
        value: value.current,
        max: value.max
      });
    })
  }

  const redefineBehavior = () => {
    restartTimer();
    setConnectionValue({});
  }

  const getValue = () => ({ value: value.current, max: value.max });

  useEffect(() => {
    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);

  useEffect(() => {
    sendValue();
  }, [value]);

  useEffect(() => {
    calcValues();
  }, [connectionValue]);

  useEffect(() => {
    restartTimer();
  }, [duration]);

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
        <p className={delayNumber}>
          {timeInterval}
        </p>
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'delayInputData'}
          type={'entry'}
          device={{
            id,
            defaultBehavior: connectionReceiver,
            redefineBehavior,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />

      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerExit}`}
      >
        <Connector
          name={'delayOutputData'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: () => {
              connectionReceiver();

              return getValue();
            },
            redefineBehavior,
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

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-delay',
            handleSaveConfig: handleSettingUpdate,
            handleRestart: restartTimer,
            defaultDuration: duration,
          })}
        >
          <AiFillSetting />
        </ActionButton>
      </div >
    </>
  );
};


Delay.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Delay;
