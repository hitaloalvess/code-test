import { memo, useRef, useState, useEffect } from 'react';
import P from 'prop-types';
import { Thermometer, Drop, Trash, Gear } from '@phosphor-icons/react';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButton';
import Connector from '@/components/Platform/Connector';
import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';

import {
  deviceBody,
  inputRangeDeviceContainer,
  inputValue,
  actionButtonsContainer,
  actionButtonsContainerLeft,
  connectorsContainer,
  connectorsContainerExit
} from '../../styles.module.css';

import {
  inputsContainer,
  thermometerIcon,
  dropIcon,
  inputDht,
  showValue,
  inputContainerDht
} from './styles.module.css';

const MAX_TEMPERATURE = 50;
const MIN_TEMPERATURE = -50;
const MAX_HUMIDITY = 1023;
const MIN_HUMIDITY = 0;

const Dht = memo(function Dht({
  device, dragRef, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [temperatureConnectorId, setTemperatureConnectorId] = useState('');
  const [humidityConnectorId, setHumidityConnectorId] = useState('');

  const inputRefTemperature = useRef(null);
  const showValueRefTemperature = useRef(null);

  const inputRefHumidity = useRef(null);
  const showValueRefHumidity = useRef(null);

  const [scaleType, setScaleType] = useState('celsius');

  const handleSettingUpdate = (newScaleType) => {
    setScaleType(newScaleType);
  }


  const getTemperature = () => {
    return {
      value: inputRefTemperature.current.value,
      max: MAX_TEMPERATURE
    };
  }


  const getHumidity = () => {
    return {
      value: inputRefHumidity.current.value,
      max: MAX_HUMIDITY
    };
  }


  const handleOnInputTemperature = () => {
    const humidityValue = Number(inputRefHumidity.current.value);

    const transformationFormula = formulasForTransformation[scaleType];
    const temperatureValue = Number(inputRefTemperature.current.value);
    showValueRefTemperature.current.innerHTML = transformationFormula(temperatureValue);

    updateValue(null, id, {
      temperature: {
        current: temperatureValue,
        max: MAX_TEMPERATURE
      },
      humidity: {
        current: humidityValue,
        max: MAX_HUMIDITY
      }
    });

    executeFlow({ connectorId: temperatureConnectorId, fromBehaviorCallback: getTemperature });
  }


  const handleOnInputHumidity = () => {
    const humidityValue = Number(inputRefHumidity.current.value);
    const temperatureValue = Number(inputRefTemperature.current.value);

    showValueRefHumidity.current.innerHTML = transformHumidityValue(humidityValue, MAX_HUMIDITY);

    updateValue(null, id, {
      temperature: {
        current: temperatureValue,
        max: MAX_TEMPERATURE
      },
      humidity: {
        current: humidityValue,
        max: MAX_HUMIDITY
      }
    });

    executeFlow({ connectorId: humidityConnectorId, fromBehaviorCallback: getHumidity });
  }


  const handleChangeTempConnector = (value) => {
    setTemperatureConnectorId(value);
  }


  const handleChangeHumidityConnector = (value) => {
    setHumidityConnectorId(value);
  }


  useEffect(() => {
    handleOnInputTemperature();
  }, [scaleType])

  return (

    <>
      <div className={inputsContainer}>
        <div className={`${inputRangeDeviceContainer} ${inputContainerDht}`}>
          <input
            className={inputDht}
            type="range"
            min={MIN_TEMPERATURE}
            max={MAX_TEMPERATURE}
            step="0.1"
            defaultValue={0}
            onInput={handleOnInputTemperature}
            ref={inputRefTemperature}
          />

          <div className={showValue}>
            <p
              className={inputValue}
              ref={showValueRefTemperature}
            >0</p>

            <Thermometer className={thermometerIcon} />

            {/* <div className={iconContainer}>
              <div className={thermometer}>
                <div className={thermometerTop}></div>
                <div className={thermometerBottom}></div>
              </div>
            </div> */}
          </div>
        </div>

        <div className={`${inputRangeDeviceContainer} ${inputContainerDht}`} >
          <input
            className={inputDht}
            type="range"
            min={MIN_HUMIDITY}
            max={MAX_HUMIDITY}
            step="1"
            defaultValue={0}
            onInput={handleOnInputHumidity}
            ref={inputRefHumidity}
          />

          <div className={showValue}>
            <p
              className={inputValue}
              ref={showValueRefHumidity}
            >0</p>

            {/* <div className={iconContainer}>
              <div className={drop}></div>
            </div> */}
            <Drop className={dropIcon} />
          </div>
        </div>

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
            defaultBehavior: getTemperature,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeTempConnector}
        />

        <Connector
          name={'humidity'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getHumidity,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeHumidityConnector}
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
          <Trash />
        </ActionButton>

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-dht',
            handleSaveConfig: handleSettingUpdate,
            scaleTypeDefault: scaleType
          })}
        >
          <Gear />
        </ActionButton>
      </div>
    </>
  );
});

Dht.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Dht;
