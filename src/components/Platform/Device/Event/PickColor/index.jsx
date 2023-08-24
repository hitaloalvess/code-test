import { useEffect, useState, useCallback } from 'react';
import P from 'prop-types';
import { Trash, Gear } from '@phosphor-icons/react';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import Connector from '@/components/Platform/Connector';
import ActionButton from '@/components/Platform/ActionButtons/ActionButton';
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
  dropPosition
} from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const PickColor = ({
  dragRef, device, updateValue
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(false);
  const [connectionValue, setConnectionValue] = useState({});
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);

  const [color, setColor] = useState('#39394E');

  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleSettingUpdate = useCallback((newColor) => {
    setColor(newColor);
  }, [color]);


  const handleConnections = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, { current: 0, max: 0, color: '#39394E' });

      return;
    }

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    const device = devices[`${connection.deviceFrom.id}`];

    let value = device.value.current;
    let max = device.value.max;


    if ([undefined, null].includes(value)) {
      //If device.value.current undefined or null, structure equal boolean (true or false) or object -> ex: {temperature:{..}, humidity:{...}
      value = typeof device.value === 'boolean' ? device.value : device.value[connection.deviceFrom.connector.name]?.current
      max = typeof device.value === 'boolean' ? device.value : device.value[connection.deviceFrom.connector.name]?.max
    }

    const objValue = {
      idConnection: connection.id,
      value,
      max,
    }

    setConnectionValue(objValue);
  }

  const calcValues = () => {
    if (!Object.hasOwn(connectionValue, 'idConnection')) {
      updateValue(setValue, id, { current: 0, max: 0, color: '#39394E' });
      return;
    }

    const newValue = {
      current: connectionValue.value,
      max: connectionValue.max,
      color: color
    };

    updateValue(setValue, id, newValue);
  }

  const sendValue = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      conn.deviceTo.defaultBehavior({
        value: value.current,
        max: value.max,
        color: value.color
      });
    })
  }

  const redefineBehavior = () => setConnectionValue({});

  const getValue = () => ({ value: value.current, max: value.max, color: value.color });

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
  }, [connectionValue, color])

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <svg
          className={dropPosition}
          width="60"
          height="75"
          viewBox="0 0 60 75"
          fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className=""
            d="M30 75C13.4375 75 0 62.4023 0 46.875C0 33.5156 20.3438 8.45215 26.0313 1.71387C26.9688 0.615234 28.3594 0 29.8594 0H30.1406C31.6406 0 33.0312 0.615234 33.9687 1.71387C39.6562 8.45215 60 33.5156 60 46.875C60 62.4023 46.5625 75 30 75ZM15 49.2188C15 47.9297 13.875 46.875 12.5 46.875C11.125 46.875 10 47.9297 10 49.2188C10 58.2861 17.8281 65.625 27.5 65.625C28.875 65.625 30 64.5703 30 63.2812C30 61.9922 28.875 60.9375 27.5 60.9375C20.5937 60.9375 15 55.6934 15 49.2188Z"
            fill={color}
          />
        </svg>

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
          name={'toggleOutputData'}
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
              disableModal('confirmation');
            }
          })}
        >
          <Trash />
        </ActionButton>

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-pickColor',
            handleSaveConfig: handleSettingUpdate,
            defaultColor: color,
          })}
        >
          <Gear />
        </ActionButton>

      </div>
    </>
  );
};


PickColor.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default PickColor;
