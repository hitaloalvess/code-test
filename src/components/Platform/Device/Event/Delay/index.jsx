import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import * as D from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const INITIAL_DURATION = 5;
const Delay = ({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) => {

  const isFirstRender = useRef(true);
  const { id, name, posX, posY, value, connectors, containerRef } = data;
  const { updateDeviceValue, devices } = useDevices();
  const { updateDeviceValueInFlow, flows } = useFlow();

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


    const device = { ...devices[connection.deviceFrom.id] };
    const deviceValue = device.value[connection.deviceFrom.connector.name];


    const newValue = {
      ...data.value,
      send: {
        ...deviceValue
      }
    }

    //Calc values

    restartTimer();

    setIntervalRef.current = setInterval(() => {
      setTimeInterval(prevTime => prevTime - 1);

    }, 1000);

    timeout.current = setTimeout(() => {

      onSaveData('value', newValue);
      updateDeviceValue(id, { value: newValue });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

      restartTimer();
    }, value.duration * 1000);
  }, [value.duration, flows, value.send]);

  const sendValue = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      devices[conn.deviceTo.id].defaultReceiveBehavior({
        value: value.send.current, max: value.send.max
      });
    })
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

    sendValue();
  }, [value.send.current]);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }
    restartTimer();
  }, [value.duration]);

  useEffect(() => {

    updateDeviceValue(id, {
      defaultSendBehavior: connectionReceiver,
      defaultReceiveBehavior: connectionReceiver,
      redefineBehavior
    })
  }, [connectionReceiver, redefineBehavior]);

  return (
    <>


      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

        <p className={D.delayNumber}>
          {timeInterval}
        </p>

        <ActionButtons
          orientation='bottom'
          active={activeActBtns}
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            typeContent: 'config-delay',
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
            data: connectors.receive,
            device: {
              id,
              containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
        entryConnectors={[
          {
            data: connectors.send,
            device: {
              id,
              containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}

      />

    </>
  );
};

Delay.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Delay;
