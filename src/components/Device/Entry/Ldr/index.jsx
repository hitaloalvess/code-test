import { memo, useRef, useState } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

import {
  deviceBody,
  inputRangeDeviceContainer,
  inputValue,
  actionButtonsContainer,
  actionButtonsContainerLeft,
  connectorsContainer,
  connectorsContainerExit
} from '../../styles.module.css';

const MAX_VALUE = 1023;
const Ldr = memo(function Ldr({
  device, dragRef, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [lumenConnectorId, setLumenConnectorId] = useState('');
  const [lumenConnectorId1, setLumenConnectorId1] = useState('');

  const inputRef = useRef(null);
  const inputRef1 = useRef(null);

  const showValueRef = useRef(null);
  const showValueRef1 = useRef(null);

  const getLuminosity = () => {
    return {
      value: Number(inputRef.current.value),
      max: MAX_VALUE
    };
  }

  const getLuminosity1 = () => {
    return {
      value: Number(inputRef1.current.value),
      max: MAX_VALUE
    };
  }

  const handleOnInput = () => {
    const temperatureValue = Number(inputRef.current.value);
    const humidityValue = Number(inputRef1.current.value);

    showValueRef.current.innerHTML = temperatureValue;

    updateValue(null, id, {
      temperature: {
        current: temperatureValue,
        max: MAX_VALUE
      },
      humidity: {
        current: humidityValue,
        max: MAX_VALUE
      }
    });

    executeFlow({ connectorId: lumenConnectorId, fromBehaviorCallback: getLuminosity });
  }

  const handleOnInput1 = () => {
    const temperatureValue = Number(inputRef.current.value);
    const humidityValue = Number(inputRef1.current.value);

    showValueRef1.current.innerHTML = humidityValue;

    updateValue(null, id, {
      temperature: {
        current: temperatureValue,
        max: MAX_VALUE
      },
      humidity: {
        current: humidityValue,
        max: MAX_VALUE
      }
    });


    executeFlow({ connectorId: lumenConnectorId1, fromBehaviorCallback: getLuminosity1 });
  }

  const handleChangeLumenConnector = (value) => {
    setLumenConnectorId(value);
  }

  const handleChangeLumenConnector1 = (value) => {
    setLumenConnectorId1(value);
  }

  return (

    <>

      <div className={inputRangeDeviceContainer}
        style={{ top: '-60px' }}

      >
        <input
          type="range"
          min="0"
          max="1023"
          step="1"
          defaultValue={0}
          onInput={handleOnInput}
          ref={inputRef}
        />
        <p
          className={inputValue}
          ref={showValueRef}
        >0</p>
      </div>

      <div className={inputRangeDeviceContainer}
        style={{ top: '-30px' }}

      >
        <input
          type="range"
          min="0"
          max="1023"
          step="1"
          defaultValue={0}
          onInput={handleOnInput1}
          ref={inputRef1}
        />
        <p
          className={inputValue}
          ref={showValueRef1}
        >0</p>
      </div>

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
        className={`${connectorsContainer} ${connectorsContainerExit}`}
      >
        <Connector
          name={'temperature'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getLuminosity
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeLumenConnector}
        />

        <Connector
          name={'humidity'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getLuminosity1
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeLumenConnector1}
        />

      </div>



      <div
        className={
          `${actionButtonsContainer} ${actionButtonsContainerLeft}`
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
});

Ldr.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Ldr;
