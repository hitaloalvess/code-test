import { useEffect, useState, useRef, useCallback } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useModal } from '@/hooks/useModal';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';
import Connector from '@/components/Connector';
import ActionButton from '@/components/ActionButton';
import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { AiFillSetting } from 'react-icons/ai';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerBottom,
  connectorsContainer,
  connectorsContainerExit,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  BodyCounterNumbers,
  counterButton,
  counterButtonDecrease,
  BodyCounterButtons
} from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/conditional/counter/counterBase.svg';
import buttonImage from '@/assets/images/devices/conditional/counter/counterChevron.svg';

const Counter = ({
  dragRef, device, updateValue
}) => {

  const { id, name, posX, posY } = device;
  const { deleteDevice, devices } = useDevices();
  const { deleteDeviceConnections, flows } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const [connectionValue, setConnectionValue] = useState([]);
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0)
  const [loopActive, setLoopActive] = useState(false);
  const [loopLimit, setLoopLimit] = useState(9999);

  const numberThousand = useRef(null);
  const numberHundred = useRef(null);
  const numberTen = useRef(null);
  const numberUnity = useRef(null);

  const connectionReceiver = () => {
    setQtdIncomingConn(prev => prev + 1)
  }

  const handleSettingUpdate = useCallback((newLoopActive, newLoopLimit) => {
    setLoopActive(newLoopActive);
    setLoopLimit(newLoopLimit);
  }, [loopActive, loopLimit]);

  const handleConnections = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {
      updateValue(setValue, id, { current: 0, max: 0 });

      return;
    }

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!connection) return;

    const device = devices.find(device => device.id === connection.deviceFrom.id);

    let value = device.value.current;
    let max = device.value.max;

    if ([undefined, null].includes(value)) {
      //If device.value.current undefined or null, structure equal boolean (true or false) or object -> ex: {temperature:{..}, humidity:{...}
      value = typeof device.value === 'boolean' || typeof device.value === 'string' ? device.value : device.value[connection.deviceFrom.connector.name]?.current
      max = typeof device.value === 'boolean' || typeof device.value === 'string' ? device.value : device.value[connection.deviceFrom.connector.name]?.max
    }

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
      return;
    }

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    let newValue;

    if (typeof connectionValue.value === 'boolean') {
      newValue = connectionValue.value ? value.current + 1 : value.current;
    } else {
      newValue = connectionValue.value || connectionValue.value === 0 ? connectionValue.value : value;
    }

    if(loopActive && newValue >= loopLimit) {
      newValue = 0;
    }

    updateValue(setValue, id, { current: newValue, max: connectionValue.max });
  }

  const displayNumbers = () => {
    if (value.current <= 9) {
      numberThousand.current.innerHTML = 0;
      numberHundred.current.innerHTML = 0;
      numberTen.current.innerHTML = 0;
      numberUnity.current.innerHTML = value.current;
      return;
    }

    const newValue = value.current.toString().split('');

    if (value.current > 9 && value.current <= 99) {
      numberThousand.current.innerHTML = 0;
      numberHundred.current.innerHTML = 0;
      numberTen.current.innerHTML = newValue[0];
      numberUnity.current.innerHTML = newValue[1];
    } else if (value.current > 99 && value.current <= 999) {
      numberThousand.current.innerHTML = 0;
      numberHundred.current.innerHTML = newValue[0];
      numberTen.current.innerHTML = newValue[1];
      numberUnity.current.innerHTML = newValue[2];
    } else if (value.current > 999) {
      numberThousand.current.innerHTML = newValue[0];
      numberHundred.current.innerHTML = newValue[1];
      numberTen.current.innerHTML = newValue[2];
      numberUnity.current.innerHTML = newValue[3];
    }
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

  const redefineBehavior = () => {
    setConnectionValue({});
  }

  const handleIncreaseClick = () => {
    let newValue = value.current + 1;
    if(loopActive && newValue >= loopLimit) {
      newValue = 0;
    }

    updateValue(setValue, id, { current: newValue, max: value.max });
  };

  const handleDecreaseClick = () => {
    const newValue = value.current - 1;
    updateValue(setValue, id, { current: newValue, max: value.max });
  };


  const getValue = () => ({ value: value.current, max: value.max });

  useEffect(() => {
    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);

  useEffect(() => {
    sendValue();
    displayNumbers();
  }, [value]);

  useEffect(() => {
    calcValues();
  }, [connectionValue, loopActive, loopLimit]);

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
        <div className={BodyCounterNumbers}>
          <div ref={numberThousand} >0</div>
          <div ref={numberHundred} >0</div>
          <div ref={numberTen} >0</div>
          <div ref={numberUnity} >0</div>
        </div>
        <div className={BodyCounterButtons}>
          <button className={counterButton} onClick={handleIncreaseClick}>
            <img src={buttonImage}
              alt="botao de incrementar" draggable="false" />
          </button>
          <button className={counterButtonDecrease} onClick={handleDecreaseClick}>
            <img src={buttonImage}
              alt="botao de decrementar" draggable="false" />
          </button>
        </div>
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'delayInputData'}
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
          name={'delayOutputData'}
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
              disableModal();
            }
          })}
        >
          <FaTrashAlt />
        </ActionButton>

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-counter',
            handleSaveConfig: handleSettingUpdate,
            defaultLoopActive: loopActive,
            defaultLoopLimit: loopLimit
          })}
        >
          <AiFillSetting />
        </ActionButton>
      </div >
    </>
  );
};


Counter.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Counter;
