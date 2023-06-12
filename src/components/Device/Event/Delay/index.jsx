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

const Delay = ({
  dragRef, device
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(false);
  const [connectionValues, setConnectionValues] = useState([]);
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0)
  const [duration, setDuration] = useState(5);
  const timeout = useRef(null);
  const interval = useRef(null);
  const showDurationRef = useRef(null);

  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleSettingUpdate = useCallback((newDuration) => {
    if (newDuration !== duration) {
      setDuration(newDuration);
    }
  }, [duration]);


  const handleConnections = () => {

    const [flow] = findFlowsByDeviceId(flows, id);

    if (!flow) {
      return;
    }

    const incomingConns = flow.connections.filter(conn => {
      return conn.deviceTo.id === id
    });


    const values = incomingConns.reduce((acc, conn) => {
      const device = devices.find(device => device.id === conn.deviceFrom.id);
      return [...acc, {
        idConnection: conn.id,
        value: [undefined, null].includes(device.value.current) ?
          device.value :
          device.value.current
      }];
    }, []);

    setConnectionValues(values);
  }

  const calcValues = () => {

    if (connectionValues.length <= 0) {
      setValue(false);
      return;
    }
    else if (connectionValues.length >= 1)
    {
      let currentDuration = duration;

      restartTimer();

      interval.current = setInterval(() => {
        currentDuration -= 1;
        showDurationRef.current.innerHTML = currentDuration;
      }, 1000);

      timeout.current = setTimeout(() => {
        setValue(connectionValues[0].value)

        restartTimer();
      }, duration * 1000);
    }
  }

  const restartTimer = () => {
    showDurationRef.current.innerHTML = duration;
    clearInterval(interval.current);
    clearTimeout(timeout.current);
  }


  useEffect(() => {
    restartTimer();
  }, [duration]);

  const sendValue = () => {
    const [flow] = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      conn.deviceTo.defaultBehavior({ value });
    })
  }

  const redefineBehavior = (data) => {
    restartTimer();

    const { idConnectionDelete } = data;

    setConnectionValues(prevConn => {
      return prevConn.filter(connValue => {
        if (connValue.idConnection !== idConnectionDelete) {
          return connValue
        }
      });
    })

  }

  const getValue = () => ({ value });

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
  }, [connectionValues]);

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
        <p ref={showDurationRef}
        className={delayNumber}>
          5
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
            redefineBehavior
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
            defaultBehavior: getValue,
            redefineBehavior
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
  dragRef: P.func.isRequired
}

export default Delay;
