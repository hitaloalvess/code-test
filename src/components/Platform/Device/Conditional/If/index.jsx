import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { Trash, Gear } from '@phosphor-icons/react';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import ConnectorsConnector from '@/components/Platform/Device/SharedDevice/Connectors/ConnectorsConnector';
import ActionButton from '@/components/Platform/Device/SharedDevice/ActionButtons/ActionButton';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerBottom,
  connectorsContainer,
  connectorsContainerExit,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  ifNumber
} from './styles.module.css';


import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const If = ({
  dragRef, device, updateValue
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const [connectionValue, setConnectionValue] = useState([]);
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0)


  const [numberVariable, setNumberVariable] = useState(0);
  const [boolVariable, setBoolVariable] = useState(false);
  const [stringVariable, setStringVariable] = useState('');
  const [variable, setVariable] = useState(0);

  const [connectionType, setConnectionType] = useState('number');
  const [simbol, setSimbol] = useState('=');


  const displayRef = useRef(null);

  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleSpecialDeviceValues = (deviceData, objValue) => {
    const devices = {
      'dht': (deviceData, objValue) => {
        const { connector } = deviceData;
        const { value, max } = objValue;

        if (connector.name === 'temperature') return objValue;

        return {
          value: Math.ceil((value * 100) / max),
          max
        };
      }
    }

    const deviceTransformValue = devices[deviceData.name];

    if (!deviceTransformValue) return objValue;

    const newValue = deviceTransformValue(deviceData, objValue);

    return newValue;
  }

  const handleSettingUpdate = useCallback((newSimbol, newVariable) => {

    switch (connectionType) {
      case 'number':
        setNumberVariable(newVariable);
        break;
      case 'boolean':
        setBoolVariable(newVariable);
        break;
      case 'string':
        setStringVariable(newVariable);
        break;
    }

    setVariable(newVariable);
    setSimbol(newSimbol);
  }, [variable, simbol, connectionType]);


  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, { value: 0, max: 0 });

      return;
    }

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!connection) return;

    const device = devices[`${connection.deviceFrom.id}`];


    let value = device.value.current;
    let max = device.value.max;

    if ([undefined, null].includes(value)) {
      //If device.value.current undefined or null, structure equal boolean (true or false) or object -> ex: {temperature:{..}, humidity:{...}
      value = typeof device.value === 'boolean' || typeof device.value === 'string' ? device.value : device.value[connection.deviceFrom.connector.name].current
      max = typeof device.value === 'boolean' || typeof device.value === 'string' ? device.value : device.value[connection.deviceFrom.connector.name].max
    }


    if (connectionType != String(typeof value)) {
      setConnectionType(String(typeof value));
      switch (String(typeof value)) {
        case 'number':
          setVariable(0);
          break;
        case 'boolean':
          setVariable(false);
          break;
        case 'string':
          setVariable('FF12F3');
          break;
      }
      setSimbol('=');
    }


    //Validates if it is a device that has a special behavior in generating its value
    const objValue = handleSpecialDeviceValues(connection.deviceFrom, { value, max });

    setConnectionValue({
      id: connection.id,
      ...connection,
      ...objValue
    });
  }

  const calcValues = () => {
    if (!Object.hasOwn(connectionValue, 'id')) {
      updateValue(setValue, id, false);
      return;
    }

    const operations = {
      '>': (newValue) => newValue > variable ? true : false,
      '<': (newValue) => newValue < variable ? true : false,
      '≥': (newValue) => newValue >= variable ? true : false,
      '≤': (newValue) => newValue <= variable ? true : false,
      '=': (newValue) => newValue === variable ? true : false,
      '≠': (newValue) => newValue != variable ? true : false
    }
    const operationType = operations[simbol];

    if (!operationType) return;

    const newValue = operationType(connectionValue.value);

    updateValue(setValue, id, newValue);
  }

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      conn.deviceTo.defaultBehavior({ value });
    })
  }

  const redefineBehavior = () => setConnectionValue({});

  const getValue = () => ({ value });

  useEffect(() => {
    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);

  useEffect(() => {
    updateDisplay();
    calcValues();

  }, [connectionValue, variable, simbol]);

  const updateDisplay = () => {
    displayRef.current.innerHTML = simbol + " " + variable;
  };

  useEffect(() => {
    sendValue();
  }, [value]);


  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <img
          src={eventBaseImg}
          alt={`Device ${name}`}
          loading='lazy'
        />
        <p ref={displayRef} className={ifNumber}>
          = 0
        </p>
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <ConnectorsConnector
          name={'ifInputData'}
          type={'entry'}
          device={{
            id,
            defaultBehavior: connectionReceiver,
            redefineBehavior,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />

      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerExit}`}
      >
        <ConnectorsConnector
          name={'ifOutputData'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: () => {
              connectionReceiver();

              return getValue();
            },
            redefineBehavior,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />

      </div>

      <div
        className={
          `${actionButtonsContainer} ${actionButtonsContainerBottom}`
        }
      >
        <ActionButton
          onClick={() => enableModal({
            typeContent: 'confirmation',
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            handleConfirm: () => {
              deleteDeviceConnections(id);
              deleteDevice(id);
              disableModal('confirmation');
            }
          })}
        >
          <Trash />
        </ActionButton>

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-if',
            handleSaveConfig: handleSettingUpdate,
            defaultSimbol: simbol,
            defaultNumber: numberVariable,
            defaultBool: boolVariable,
            defaultString: stringVariable,
            connectionType: connectionType,
          })}
        >
          <Gear />
        </ActionButton>
      </div >
    </>
  );
};


If.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default If;
