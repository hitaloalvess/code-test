import { useEffect, useState } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import Connector from '@/components/Connector';
import ActionButton from '@/components/ActionButton';
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
  toggleInput,
  toggleLabel
} from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const devicesDbClick = ['pushButton'];
const Toggle = ({
  dragRef, device, updateValue
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(false);
  const [connectionValue, setConnectionValue] = useState({});
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);

  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, false);

      return;
    }

    const incomingConns = flow.connections.filter(conn => {
      return conn.deviceTo.id === id
    });

    const value = incomingConns.reduce((acc, conn) => {
      const device = devices.find(device => device.id === conn.deviceFrom.id);
      return {
        idConnection: conn.id,
        name: device.name,
        value: [undefined, null].includes(device.value.current) ?
          device.value :
          device.value.current
      };
    }, {});

    setConnectionValue(value);

  }

  const calcValues = () => {
    if (!Object.hasOwn(connectionValue, 'idConnection')) {
      updateValue(setValue, id, false);

      return;
    }
    const currentValue = connectionValue.value;

    if (devicesDbClick.includes(connectionValue.name)) {
      let newValue = value;
      if (currentValue) {
        newValue = value ? false : true;
      }

      updateValue(setValue, id, newValue);
      return;
    }

    if (typeof currentValue === 'boolean') {
      const newValue = currentValue && !value ? true : false;

      updateValue(setValue, id, newValue);
      return;
    }

    if (typeof currentValue === 'number') {
      const newValue = currentValue > 0 ? true : false

      updateValue(setValue, id, newValue);
      return;
    }

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
    sendValue();
  }, [value]);

  useEffect(() => {
    calcValues();
  }, [connectionValue])

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <input
          type="checkbox"
          checked={value}
          className={toggleInput}
          readOnly={true}
        />
        <label className={toggleLabel}></label>

        <img
          src={eventBaseImg}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'toggleInputData'}
          type={'entry'}
          device={{
            id,
            defaultBehavior: connectionReceiver,
            redefineBehavior
          }}
          updateConn={{ posX, posY }}
        />

      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerExit}`}
      >
        <Connector
          name={'toggleOutputData'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getValue,
            redefineBehavior
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
              disableModal();
            }
          })}
        >
          <FaTrashAlt />
        </ActionButton>

      </div>
    </>
  );
};


Toggle.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Toggle;
