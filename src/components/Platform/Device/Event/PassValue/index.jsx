import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import * as D from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';


const PassValue = ({
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
  const [currentValue, setCurrentValue] = useState(value.send.current);

  const connectionReceiver = useCallback(() => {

    setQtdIncomingConn(prev => prev + 1);
  }, [])

  const handleSettingUpdate = useCallback((newCurrentValue) => {
    setCurrentValue(newCurrentValue);

    const newValue = {
      send: {
        current: newCurrentValue,
      },
      sendValue: value.sendValue,
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
  }, [value.send.current]);


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

      return;
    }

    const device = { ...devices[connection.deviceFrom.id] };

    let valueReceived = device.value[connection.deviceFrom.connector.name].current;

    //Calc values

    let currentValueSend;
    if (typeof valueReceived === 'boolean') {

      currentValueSend = valueReceived;

    }
    else if (typeof valueReceived === 'number') {

      currentValueSend = valueReceived > 0 ? true : false;

    }

    if (currentValueSend == true) {
        const newValue = {
          send: {
            current: currentValue,
          },
          sendValue: currentValueSend,
        }

      onSaveData('value', newValue);
      updateDeviceValue(id, { value: newValue });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });
      sendValue();
    }
    return;
  };

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({
        value: value.send.current
      });
    })
  };

  const redefineBehavior = useCallback(() => {

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

  return (
    <>
      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <p className={D.delayNumber}>
          {currentValue}
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
            typeContent: 'config-passValue',
            onSave: handleSettingUpdate,
            data: {
              defaultValueSet: currentValue,
            }
          }}
        />
      </DeviceBody>
      <Connectors
        type='doubleTypes'
        exitConnectors={[
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
        entryConnectors={[
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

      />

    </>
  );
};

PassValue.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default PassValue;
