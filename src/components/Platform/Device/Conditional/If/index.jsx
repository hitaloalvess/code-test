import { useEffect, useCallback, useState, useRef } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import {
  ifNumber
} from './styles.module.css';


import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const defaultValuesOfType = {
  'number': 0,
  'boolean': false,
  'string': 'FF12F3'
}

const If = ({
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

  const isFirstRender = useRef(true);
  const [connectionValue, setConnectionValue] = useState({});
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);


  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleSpecialDeviceValues = (deviceData, objValue) => {
    const devices = {
      'dht': (deviceData, objValue) => {

        const { connector } = deviceData;
        const { current, max } = objValue;

        if (connector.name === 'temperature') return objValue;

        return {
          current: Math.ceil((current * 100) / 1023),
          max
        };
      }
    }

    const deviceTransformValue = devices[deviceData.name];

    if (!deviceTransformValue) return objValue;

    const newValue = deviceTransformValue(deviceData, objValue);

    return newValue;
  }

  const handleSettingUpdate = useCallback((newSimbol, newNumberDisplay) => {

    const newValue = {
      ...data.value,
      numberDisplay: newNumberDisplay,
      simbol: newSimbol
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

    setQtdIncomingConn(prev => prev + 1);

  }, [value.connectionType]);


  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow?.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!flow || !connection) {

      const value = {
        ...data.value,
        send: {
          current: 0,
        }
      }

      onSaveData('value', value)
      updateDeviceValue(id, { value });
      return;
    }


    const device = { ...devices[connection.deviceFrom.id] };

    const deviceValue = device.value[connection.deviceFrom.connector.name];

    const typeValue = typeof deviceValue.current;

    if (value.connectionType !== typeValue) {

      const defaultValue = defaultValuesOfType[typeValue];

      const newValue = {
        ...data.value,
        numberDisplay: defaultValue,
        simbol: '=',
        connectionType: typeValue
      }

      onSaveData('value', newValue)
      updateDeviceValue(id, { value: newValue });
    }

    //Validates if it is a device that has a special behavior in generating its value
    const objValue = handleSpecialDeviceValues(connection.deviceFrom, { current: deviceValue.current });

    setConnectionValue({
      id: connection.id,
      ...connection,
      value: { ...objValue }
    });

  }

  const calcValues = () => {

    if (!Object.hasOwn(connectionValue, 'id')) {
      return;
    }

    const operations = {
      '>': (newValue) => newValue > value.numberDisplay ? true : false,
      '<': (newValue) => newValue < value.numberDisplay ? true : false,
      '≥': (newValue) => newValue >= value.numberDisplay ? true : false,
      '≤': (newValue) => newValue <= value.numberDisplay ? true : false,
      '=': (newValue) => newValue === value.numberDisplay ? true : false,
      '≠': (newValue) => newValue != value.numberDisplay ? true : false
    }
    const operationType = operations[value.simbol];

    if (!operationType) return;


    const newValue = {
      ...data.value,
      send: {
        current: operationType(connectionValue.value.current)
      }
    }

    if (newValue.send.current === data.value.send.current) {
      sendValue();

      return;
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue })
  }

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({ value: value.send.current });
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

    handleConnections();

  }, [qtdIncomingConn]);

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    calcValues();

  }, [connectionValue, value.numberDisplay, value.simbol]);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    sendValue();
  }, [value.send.current]);


  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <p className={ifNumber}>
          {`${value.simbol} ${value.numberDisplay}`}
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
            typeContent: 'config-if',
            onSave: handleSettingUpdate,
            data: {
              defaultSimbol: value.simbol,
              defaultValue: value.numberDisplay,
              connectionType: value.connectionType,
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


If.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default If;
