import { memo, useState, useEffect, useMemo } from 'react';
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
  device, dragRef
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice, updateDeviceValue } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [deviceData, setDeviceData] = useState(device);

  const [scaleType, setScaleType] = useState('celsius');

  const transformationFormula = useMemo(() => {
    return formulasForTransformation[scaleType];
  }, [scaleType]);


  const handleSettingUpdate = (newScaleType) => {
    setScaleType(newScaleType);
  }

  const handleGetValue = (typeValue) => {
    if (!['temperature', 'humidity'].includes(typeValue)) return;

    if (typeValue === 'temperature') {
      return {
        value: deviceData.value.temperature.current,
        max: MAX_TEMPERATURE
      };
    }

    if (typeValue === 'humidity') {
      return {
        value: deviceData.value.humidity.current,
        max: MAX_HUMIDITY
      };
    }

  }

  const handleOnInput = (event, name) => {
    const inputValue = Number(event.target.value);

    const value = {
      ...deviceData.value,
      [`${name}`]: {
        ...deviceData.value[`${name}`],
        current: inputValue,
      }
    }

    setDeviceData({ ...deviceData, value });

    updateDeviceValue(id, { value })

  }

  const handleSaveConnData = (value) => {
    setDeviceData(prev => {
      return {
        ...prev,
        connectors: {
          ...prev.connectors,
          [`${value.name}`]: value
        }
      }
    });
  }

  useEffect(() => {
    executeFlow({ connectorId: deviceData.connectors.temperature.id, fromBehaviorCallback: () => handleGetValue(deviceData.connectors.temperature.name) });

  }, [deviceData.value.temperature.current]);

  useEffect(() => {
    executeFlow({ connectorId: deviceData.connectors.humidity.id, fromBehaviorCallback: () => handleGetValue(deviceData.connectors.humidity.name) });
  }, [deviceData.value.humidity.current]);

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
            defaultValue={deviceData.value.temperature.current}
            onInput={(event) => handleOnInput(event, 'temperature')}
          />

          <div className={showValue}>
            <p
              className={inputValue}
            >
              {transformationFormula(deviceData.value.temperature.current)}
            </p>

            <Thermometer className={thermometerIcon} />

          </div>
        </div>

        <div className={`${inputRangeDeviceContainer} ${inputContainerDht}`} >
          <input
            className={inputDht}
            type="range"
            min={MIN_HUMIDITY}
            max={MAX_HUMIDITY}
            step="1"
            defaultValue={deviceData.value.humidity.current}
            onInput={(event) => handleOnInput(event, 'humidity')}
          />

          <div className={showValue}>
            <p
              className={inputValue}
            >
              {transformHumidityValue(deviceData.value.humidity.current, MAX_HUMIDITY)}
            </p>

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

        {
          Object.values(deviceData.connectors).map((connector, index) => (
            <Connector
              key={index}
              data={connector}
              device={{
                id,
                defaultBehavior: () => handleGetValue(connector.name),
                containerRef: device.containerRef
              }}
              updateConn={{ posX, posY }}
              handleChangeData={handleSaveConnData}
            />
          ))
        }

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
              disableModal('confirmation');
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
}

export default Dht;
