import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import { AiFillSetting } from 'react-icons/ai';

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
  numberValue,
  rangeSlider
} from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

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

  const handleSettingUpdate = useCallback((newLimit) => {
    if (newLimit !== limit) {
      setLimit(newLimit);
    }
  }, [limit]);


  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleConnections = () => {
    const [flow] = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, { value: 0, max: 0 });

      return;
    }

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    const deviceFrom = devices.find(device => device.id === connection.deviceFrom.id);

    const value = {
      idConnection: connection.id,
      value: deviceFrom.value.current,
      max: deviceFrom.value.max
    }

    setConnectionValue(value);

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
    const [flow] = findFlowsByDeviceId(flows, id);

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
          value={value}
          readOnly={true}
        />

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
          name={'sliderInputData'}
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
          name={'sliderOutputData'}
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

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-slider',
            handleSaveConfig: handleSettingUpdate,
            defaultMaxValue: limit
          })}
        >
          <AiFillSetting />
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
