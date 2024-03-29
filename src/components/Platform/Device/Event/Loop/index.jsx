import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import * as L from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/loopBase.svg';

const INITIAL_DURATION = 5;
const Loop = ({
  data, dragRef, onSaveData
}) => {

  const isFirstRender = useRef(true);
  const { id, name, posX, posY, value, connectors } = data;

  const {
    flows,
    devices,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    flows: store.flows,
    devices: store.devices,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);

  const [timeInterval, setTimeInterval] = useState(INITIAL_DURATION);
  const timeout = useRef(null);
  const setIntervalRef = useRef(null);

  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1);
  }, [])

  const handleSettingUpdate = useCallback((newDuration) => {
    const newValue = {
      ...data.value,
      duration: newDuration
    }
    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
  }, [value.duration]);

  const restartTimer = () => {
    setTimeInterval(value.duration);
    clearInterval(setIntervalRef.current);
    clearTimeout(timeout.current);
  }

  const handleConnections = useCallback(() => {
    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow?.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    const connOutput = flow?.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    if (!flow || !connection || connOutput.length <= 0) return;

    handleTimerAction();


  }, [flows]);


  const handleTimerAction = () => {

    restartTimer();

    setIntervalRef.current = setInterval(() => {
      setTimeInterval(prevTime => prevTime - 1);
    }, 1000);

    timeout.current = setTimeout(() => {

      restartTimer();
      sendValue();
      handleTimerAction();
    }, value.duration * 1000);
  }

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow?.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    const device = { ...devices[connection.deviceFrom.id] };
    const deviceValue = device.value[connection.deviceFrom.connector.name];


    const newValue = {
      ...data.value,
      send: {
        ...deviceValue
      }
    }


    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({
        value: newValue.send.current, max: newValue.send.max
      });
    })

    if (newValue.send.current !== value.send.current) {
      onSaveData('value', newValue);
      updateDeviceValue(id, { value: newValue });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });
    }

  }

  const redefineBehavior = useCallback(() => {
    restartTimer();

    const value = {
      ...data.value,
      send: {
        current: 0,
        max: 0
      }
    }

    onSaveData('value', value)
    updateDeviceValue(id, { value });

  }, []);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }
    restartTimer();
  }, [value.duration]);

  useEffect(() => {

    return () => {
      clearInterval(setIntervalRef.current);
      clearTimeout(timeout.current);
    }
  }, []);

  return (
    <>


      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <p className={L.loopNumber}>
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
          actionConfig={{
            typeContent: 'config-loop',
            onSave: handleSettingUpdate,
            data: {
              handleRestart: restartTimer,
              defaultDuration: value.duration,
            }
          }}
        />
      </DeviceBody>

      <Connectors
        type='doubleTypes'
        exitConnectors={[
          {
            data: {
              ...connectors.send,
              defaultSendBehavior: connectionReceiver,
              redefineBehavior
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
        entryConnectors={[
          {

            data: {
              ...connectors.receive,
              defaultReceiveBehavior: connectionReceiver,
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
};

Loop.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Loop;
