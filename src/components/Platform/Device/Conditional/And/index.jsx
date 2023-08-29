import { useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

const And = ({
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
  const { updateDeviceValue, devices } = useDevices();
  const { flows, updateDeviceValueInFlow } = useFlow();

  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);

  const handleGetValue = () => ({ value });

  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleConnections = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {

      const value = {
        ...data.value,
        send: {
          current: false
        }
      }

      onSaveData('value', value)
      updateDeviceValue(id, { value });

      return;
    }

    const incomingConns = flow.connections.filter(conn => {
      return conn.deviceTo.id === id
    });

    const values = incomingConns.reduce((acc, conn) => {

      const device = { ...devices[conn.deviceFrom.id] };

      let value = device.value[conn.deviceFrom.connector.name]?.current;

      return [...acc, {
        idConnection: conn.id,
        value,
      }];

    }, []);


    //Calc values
    if (values.length <= 0) {
      const value = {
        ...data.value,
        send: {
          current: false
        }
      }

      onSaveData('value', value)
      updateDeviceValue(id, { value });

      return;
    }

    const incomingConnsValues = values.map(connInput => !connInput.value === false);
    const allValidValues = incomingConnsValues.every(value => value === true);

    const value = {
      ...data.value,
      send: {
        current: allValidValues,
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
      conn.deviceTo.defaultBehavior({ value: value.send.current });
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
      defaultBehavior: connectionReceiver,
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
              defaultBehavior: connectionReceiver,
              redefineBehavior,
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
              defaultBehavior: handleGetValue,
              redefineBehavior,
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


And.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default And;
