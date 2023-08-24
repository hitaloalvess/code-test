import { useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { Trash, Gear } from '@phosphor-icons/react';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import { findFlowsByDeviceId } from '@/utils/flow-functions';
import ConnectorsConnector from '@/components/Platform/Device/SharedDevice/Connectors/ConnectorsConnector';
import ActionButton from '@/components/Platform/Device/SharedDevice/ActionButtons/ActionButton';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerBottom,
  connectorsContainer,
  connectorsContainerExit,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  numberValue,
  rangeSlider
} from './styles.module.css';


const Slider = ({
  dragRef, device, updateValue
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const [limit, setLimit] = useState(1023);
  const [connectionValue, setConnectionValue] = useState({});
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);
  const showValueRef = useRef(null);

  const handleSettingUpdate = (newLimit) => {
    setLimit(newLimit);
  };


  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleConnections = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, { value: 0, max: 0 });

      return;
    }

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    const device = devices[`${connection.deviceFrom.id}`];

    const value = Object.hasOwn(device.value, 'current') ? device.value.current : device.value[connection.deviceFrom.connector.name].current;
    const max = Object.hasOwn(device.value, 'max') ? device.value.max : device.value[connection.deviceFrom.connector.name].max;

    const objValue = {
      idConnection: connection.id,
      value,
      max
    }

    setConnectionValue(objValue);
  }

  const calcValues = () => {
    if (!Object.hasOwn(connectionValue, 'idConnection')) {
      updateValue(setValue, id, { current: 0, max: 0 });

      showValueRef.current.innerHTML = 0;

      return;
    }

    const newValue = connectionValue.value > limit ? {
      current: limit,
      max: connectionValue.max
    } : {
      current: connectionValue.value,
      max: connectionValue.max
    };

    showValueRef.current.innerHTML = newValue.current;

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
        max: value.max
      });
    })
  }

  const redefineBehavior = () => setConnectionValue({})


  const getValue = () => ({ value: value.current, max: value.max });

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
  }, [connectionValue, limit])

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <p
          className={numberValue}
          ref={showValueRef}
        >
          0
        </p>

        <input
          type="range"
          min='0'
          className={rangeSlider}
          max={limit}
          value={value.current}
          readOnly={true}
        />

        <img
          src={eventBaseImg}
          alt={`Device ${name}`}
        />
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <ConnectorsConnector
          name={'sliderInputData'}
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
          name={'sliderOutputData'}
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
            typeContent: 'config-slider',
            handleSaveConfig: handleSettingUpdate,
            defaultMaxValue: limit
          })}
        >
          <Gear />
        </ActionButton>
      </div>
    </>
  );
};


Slider.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Slider;
