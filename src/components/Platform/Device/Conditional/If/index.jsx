import { useEffect, useCallback, useState, useRef } from 'react';
import P from 'prop-types';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';

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
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
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


  const isFirstRender = useRef(true);
  const { updateDeviceValue, devices } = useDevices();
  const { updateDeviceValueInFlow, flows } = useFlow();

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

    // setVariable(newVariable);
    // setSimbol(newSimbol);
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
      conn.deviceTo.defaultReceiveBehavior({ value: value.send.current });
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
        imgSrc={eventBaseImg}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

        <p className={ifNumber}>
          {`${value.simbol} ${value.numberDisplay}`}
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


If.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default If;
