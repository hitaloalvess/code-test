import { useEffect, useState } from 'react';
import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import Connector from '@/components/Platform/Connector';
import ActionButton from '@/components/Platform/ActionButton';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerBottom,
  connectorsContainer,
  connectorsContainerExit,
  connectorsContainerEntry
} from '../../styles.module.css';

const Not = ({
  dragRef, device, updateValue
}) => {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
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

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    const device = devices.find(device => device.id === connection.deviceFrom.id);
    let value = device.value.current;

    if ([undefined, null].includes(value)) {
      //If device.value.current undefined or null, structure equal boolean (true or false) or object -> ex: {temperature:{..}, humidity:{...}
      value = typeof device.value === 'boolean' ? device.value : device.value[connection.deviceFrom.connector.name].current
    }

    const objValue = {
      idConnection: connection.id,
      value
    }

    setConnectionValue(objValue);

  }

  const calcValues = () => {
    if (!Object.hasOwn(connectionValue, 'idConnection')) {
      updateValue(setValue, id, false);
      return;
    }
    const incomingConnValue = !connectionValue.value === false;

    updateValue(setValue, id, !incomingConnValue);
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

        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'notInputData'}
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
        <Connector
          name={'notOutputData'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getValue,
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
              disableModal();
            }
          })}
        >
          <Trash />
        </ActionButton>

      </div>
    </>
  );
};


Not.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Not;
