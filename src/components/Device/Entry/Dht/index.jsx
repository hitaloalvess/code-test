import { memo, useRef, useCallback, useState, useEffect } from 'react';
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

import {
  teste,
  iconContainer,
  drop,
  thermometer,
  thermometerBottom,
  inputDht
} from './styles.module.css';
import { AiFillSetting } from 'react-icons/ai';


const Dht = memo(function Dht({
  device, dragRef, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [temperatureConnectorId, setTemperatureConnectorId] = useState('');
  const [humidityConnectorId, setHumidityConnectorId] = useState('');

  const minValueTemperature = -50;
  const maxValueTemperature = 50;
  const maxValueHumidity = 100;

  const inputRefTemperature = useRef(null);
  const showValueRefTemperature = useRef(null);

  const inputRefHumidity = useRef(null);
  const showValueRefHumidity = useRef(null);

  const [scaleType, setScaleType] = useState('celsius');

  const handleSettingUpdate = useCallback((newScaleType) => {
    setScaleType(newScaleType);
  }, [scaleType]);

  const getTemperature = () => {
    return {
      value: inputRefTemperature.current.value,
      max: maxValueTemperature
    };
  }

  const getHumidity = () => {
    return {
      value: inputRefHumidity.current.value,
      max: maxValueHumidity
    };
  }


  const handleOnInputTemperature = () => {
    const humidityValue = Number(inputRefHumidity.current.value);


    const formulasForTransformation = {
      celsius: (temp) => {
        const convertedValue = Number(temp);
        return `${convertedValue.toFixed(2)} °C`;
      },
      fahrenheit: (temp) => {
        const convertedValue = (Number(temp) * (9 / 5)) + 32;
        return `${convertedValue.toFixed(2)} F`;
      },
      kelvin: (temp) => {
        const convertedValue = Number(temp) + 273.15;
        return `${(convertedValue).toFixed(2)} K`;
      }
    }

    const transformationFormula = formulasForTransformation[scaleType];
    const temperatureValue = transformationFormula(Number(inputRefTemperature.current.value));
    showValueRefTemperature.current.innerHTML = temperatureValue;

    updateValue(null, id, {
      temperature: {
        current: temperatureValue,
        max: maxValueTemperature
      },
      humidity: {
        current: humidityValue,
        max: maxValueHumidity
      }
    });

    executeFlow({ connectorId: temperatureConnectorId, fromBehaviorCallback: getTemperature });
  }

  useEffect(() => {
    handleOnInputTemperature();
  }, [scaleType])

  const handleOnInputHumidy = () => {
    const humidityValue = Number(inputRefHumidity.current.value);
    const temperatureValue = Number(inputRefTemperature.current.value);
    showValueRefHumidity.current.innerHTML = humidityValue + "%";

    updateValue(null, id, {
      temperature: {
        current: temperatureValue,
        max: maxValueTemperature
      },
      humidity: {
        current: humidityValue,
        max: maxValueHumidity
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

  return (

    <>
      <div className={teste}>
        <div className={inputRangeDeviceContainer}>
          <input
            className={inputDht}
            type="range"
            min={minValueTemperature}
            max={maxValueTemperature}
            step="0.1"
            defaultValue={0}
            onInput={handleOnInputTemperature}
            ref={inputRefTemperature}
          />

          <p
            className={inputValue}
            ref={showValueRefTemperature}
          >0</p>

          <div className={iconContainer}>
            <div className={thermometer}>
              <div className={thermometerBottom}></div>
            </div>
          </div>
        </div>

        <div className={inputRangeDeviceContainer}>
          <input
            className={inputDht}
            type="range"
            min="0"
            max={maxValueHumidity}
            step="1"
            defaultValue={0}
            onInput={handleOnInputHumidy}
            ref={inputRefHumidity}
          />

          <p
            className={inputValue}
            ref={showValueRefHumidity}
          >0</p>

          <div className={iconContainer}>
            <div className={drop}></div>
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
          <FaTrashAlt />
        </ActionButton>

        <ActionButton
          onClick={() => enableModal({
            typeContent: 'config-dht',
            handleSaveConfig: handleSettingUpdate
          })}
        >
          <AiFillSetting />
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
