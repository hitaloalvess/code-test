import { useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

const Not = ({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) => {
  const isFirstRender = useRef(true);
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


  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow?.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!flow || !connection) {

      const value = {
        ...data.value,
        send: {
          current: false
        }
      }

      onSaveData('value', value)
      updateDeviceValue(id, { value });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue: value })


      return;
    }

    const device = { ...devices[connection.deviceFrom.id] };

    let valueReceived = device.value[connection.deviceFrom.connector.name].current;

    const incomingConnValue = !valueReceived === false;

    const value = {
      ...data.value,
      send: {
        current: !incomingConnValue,
      }
    }

    onSaveData('value', value);
    updateDeviceValue(id, { value });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue: value })


  }

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      devices[conn.deviceTo.id].defaultReceiveBehavior({ value: value.send.current });
    })
  }

  const redefineBehavior = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1);
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

    updateDeviceValue(id, {
      defaultReceiveBehavior: connectionReceiver,
      redefineBehavior
    })
  }, [connectionReceiver, redefineBehavior]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

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


Not.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Not;
