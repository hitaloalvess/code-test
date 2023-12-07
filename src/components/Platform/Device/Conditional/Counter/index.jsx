import { useEffect, useState, useCallback } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import CounterDisplay from './CounterDisplay';

import eventBaseImg from '@/assets/images/devices/conditional/counter/counterBase.svg';

const Counter = ({
  data, dragRef, onSaveData
}) => {

  const {
    id,
    name,
    posX,
    posY,
    value,
    connectors,
  } = data;

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

  const [qtdIncomingConn, setQtdIncomingConn] = useState(0)

  const handleSettingUpdate = useCallback((newLoopActive, newLoopLimit) => {
    const newValue = {
      ...data.value,
      loopActive: newLoopActive,
      loopLimit: newLoopLimit
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

    setQtdIncomingConn(prev => prev + 1);
  }, [value.loopActive, value.loopLimit]);

  const handleRestart = () => {
    redefineBehavior();
  };

  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleConnections = () => {
    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow?.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!flow || !connection) {
      redefineBehavior();

      return;
    }
    const device = { ...devices[connection.deviceFrom.id] };
    const deviceValue = device.value[connection.deviceFrom.connector.name];

    const currentValue = deviceValue?.current;
    let newValue;

    if (typeof deviceValue.current === 'boolean') {
      if (deviceValue.current)
        handleIncreaseClick();
    }
    else
    {

      if (value.loopActive)
      {
        const x = Math. floor(currentValue / value.loopLimit);

        newValue = {
          ...value,
          send: {
            ...value.send,
            current:  currentValue - (value.loopLimit * x),
            max: 1023,
          }
        }
      }
      else
      {
        newValue = {
          ...value,
          send: {
            ...value.send,
            current: currentValue,
            max: 1023,
          }
        }
      }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });
  }
}


  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({
        value: value.send.current,
        max: value.send.max
      });
    })
  }


  const redefineBehavior = useCallback(() => {
    const newValue = {
        ...value,
        send: {
          ...value.send,
          current: 0,
          max: 1023,
        }
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
  }, [value]);


  const handleIncreaseClick = () => {
    let newValue;
    if(value.loopActive && value.send.current >= value.loopLimit - 1) {
      newValue = {
        ...value,
        send: {
          ...value.send,
          current: 0

        }
      }
    }
    else
    {
      newValue = {
        ...value,
        send: {
          ...value.send,
          current: value.send.current + 1

        }
      }
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

  };

  const handleDecreaseClick = () => {
    let newValue;

    if(value.send.current <= 0) {
      if(value.loopActive) {
        newValue = {
          ...value,
          send: {
            ...value.send,
            current: value.loopLimit - 1
          }
        }
      }
    }
    else
    {
        newValue = {
          ...value,
          send: {
            ...value.send,
            current: value.send.current - 1
          }
        }
    }


    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });
  };


  useEffect(() => {
    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn, value.loopActive, value.loopLimit]);

  useEffect(() => {
    sendValue();
  }, [value.send.current, value.loopActive, value.loopLimit]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <CounterDisplay
          value={value.send.current}
          onIncrease={handleIncreaseClick}
          onDecrease={handleDecreaseClick}
        />

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
            typeContent: 'config-counter',
            onSave: handleSettingUpdate,
            data: {
              defaultLoopActive: value.loopActive,
              defaultLoopLimit: value.loopLimit,
              handleRestart: handleRestart
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
              defaultSendBehavior: connectionReceiver
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
              redefineBehavior: redefineBehavior
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


Counter.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Counter;
