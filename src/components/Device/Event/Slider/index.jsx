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

  const [value, setValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1023);
  const [connectionValues, setConnectionValues] = useState([]);
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);
  const showValueRef = useRef(null);

  const handleSettingUpdate = useCallback((newMaxValue) => {
    if (newMaxValue !== maxValue) {
      setMaxValue(newMaxValue);
    }
  }, [maxValue]);


  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleConnections = () => {
    const [flow] = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, false);

      return;
    }

    const incomingConns = flow.connections.filter(conn => {
      return conn.deviceTo.id === id
    });

    const values = incomingConns.reduce((acc, conn) => {
      const device = devices.find(device => device.id === conn.deviceFrom.id);
      return [...acc, {
        idConnection: conn.id,
        value: [undefined, null].includes(device.value.current) ?
          device.value :
          device.value.current
      }];
    }, []);

    setConnectionValues(values);

  }

  const calcValues = () => {
    if (connectionValues.length <= 0) {
      updateValue(setValue, id, 0);
      return;
    }

    let newValue = connectionValues[0].value > maxValue ? maxValue : connectionValues[0].value;

    showValueRef.current.innerHTML = newValue;

    updateValue(setValue, id, newValue);
  }

  const sendValue = () => {
    const [flow] = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      conn.deviceTo.defaultBehavior({ value });
    })
  }

  const redefineBehavior = (data) => {
    const { idConnectionDelete } = data;

    setConnectionValues(prevConn => {
      return prevConn.filter(connValue => {
        if (connValue.idConnection !== idConnectionDelete) {
          return connValue
        }
      });
    })

  }

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
  }, [connectionValues, maxValue])

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
          max={maxValue}
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
            defaultMaxValue: maxValue
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
