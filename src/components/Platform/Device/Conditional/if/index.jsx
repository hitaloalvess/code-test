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

import * as I from './styles.module.css';

import baseImg from '@/assets/images/devices/conditional/if/ifBase.svg';

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
    updateDeviceValueInFlow,
  } = useStore(store => ({
    flows: store.flows,
    devices: store.devices,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow,
    executeFlow: store.executeFlow,
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    handleConnections();

  }, [qtdIncomingConn]);

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
      sendIf: {
        current: operationType(connectionValue.value.current),
      },
      sendElse: {
        current: operationType(connectionValue.value.current) == true ? false : true,
      }
    }

    if (newValue.sendIf.current === data.value.sendIf.current) {
      sendValue();

      return;
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.sendIf.id, newValue: newValue.sendIf})
    updateDeviceValueInFlow({ connectorId: connectors.sendElse.id, newValue: newValue.sendElse})
  }

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    calcValues();

  }, [connectionValue, value.numberDisplay, value.simbol]);


  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    const connsIf= connsOutput.filter(conn => {
      return conn.deviceFrom.connector.id === data.connectors.sendIf.id
    });

    const connsElse= connsOutput.filter(conn => {
      return conn.deviceFrom.connector.id === data.connectors.sendElse.id
    });

    connsIf.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({ value: value.sendIf.current});
    })

    connsElse.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({ value: value.sendElse.current});
    })
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    sendValue();
  }, [value.sendElse.current, value.sendIf.current]);


  return (
    <>

      <DeviceBody
        classesForBody={[I.bg]}
        name={name}
        imgSrc={baseImg}
        ref={dragRef}
      >

        <p className={ifNumber}>
         if {`${value.simbol} ${value.numberDisplay}`} <br />
         else
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
            typeContent: 'config-comparator',
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
              ...connectors.sendIf,
              defaultSendBehavior: connectionReceiver
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
          {
            data: {
              ...connectors.sendElse,
              defaultSendBehavior: connectionReceiver
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          }
        ]}
        entryConnectors={[
          {
            data: {
              ...connectors.receive,
              defaultReceiveBehavior: connectionReceiver
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          }
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
