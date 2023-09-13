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
    containerRef
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

    let currentValue = deviceValue?.current;

    if (typeof deviceValue.current === 'boolean') {
      currentValue = deviceValue?.current ? value.send.current + 1 : value.send.current;
    }


    const newValue = {
      ...value,
      send: {
        ...value.send,
        current: currentValue,
      }
    }

    if (newValue.send.current === value.send.current) {
      sendValue();

      return;
    }

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

  }


  const sendValue = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });


    connsOutput.forEach(conn => {
      devices[conn.deviceTo.id].defaultReceiveBehavior({
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
    const newValue = {
      ...value,
      send: {
        ...value.send,
        current: value.send.current + 1
      }
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

  };

  const handleDecreaseClick = () => {
    const newValue = {
      ...value,
      send: {
        ...value.send,
        current: value.send.current - 1
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
  }, [qtdIncomingConn]);

  useEffect(() => {
    sendValue();
  }, [value.send.current]);

  useEffect(() => {

    updateDeviceValue(id, {
      defaultSendBehavior: connectionReceiver,
      defaultReceiveBehavior: connectionReceiver,
    })
  }, [connectionReceiver]);

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


Counter.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Counter;
