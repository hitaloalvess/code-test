import { memo, useState, useEffect, useMemo } from 'react';
import P from 'prop-types';
import { Thermometer, Drop } from '@phosphor-icons/react';

import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';
import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';

import { deviceBody } from '../../styles.module.css';

import {
  thermometerIcon,
  dropIcon,
  inputDht,
  inputContainerDht
} from './styles.module.css';

const MAX_TEMPERATURE = 50;
const MIN_TEMPERATURE = -50;
const MAX_HUMIDITY = 1023;
const MIN_HUMIDITY = 0;

const Dht = memo(function Dht({
  device, dragRef, activeActBtns, onChangeActBtns
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { updateDeviceValue } = useDevices();
  const { executeFlow, updateDeviceValueInFlow } = useFlow();

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
    updateDeviceValue(id, {
      connectors: {
        ...deviceData.connectors
      }
    })
  }, [deviceData.connectors]);

  useEffect(() => {
    updateDeviceValue(id, {
      defaultBehavior: () => handleGetValue('temperature')
    });

    updateDeviceValueInFlow({ connectorId: deviceData.connectors.temperature.id, newValue: deviceData.value.temperature });

    executeFlow({ connectorId: deviceData.connectors.temperature.id, fromBehaviorCallback: () => handleGetValue(deviceData.connectors.temperature.name) });

  }, [deviceData.value.temperature.current]);

  useEffect(() => {
    updateDeviceValue(id, {
      defaultBehavior: () => handleGetValue('humidity')
    });

    updateDeviceValueInFlow({ connectorId: deviceData.connectors.humidity.id, newValue: deviceData.value.humidity });

    executeFlow({ connectorId: deviceData.connectors.humidity.id, fromBehaviorCallback: () => handleGetValue(deviceData.connectors.humidity.name) });
  }, [deviceData.value.humidity.current]);

  return (

    <>

      <DeviceInputs
        inputs={[
          {
            data: {
              type: 'range',
              minValue: MIN_TEMPERATURE,
              maxValue: MAX_TEMPERATURE,
              step: 0.1,
              defaultValue: deviceData.value.temperature.current,
              onInput: (event) => handleOnInput(event, 'temperature'),
              onTransformValue: () => transformationFormula(deviceData.value.temperature.current)
            },
            className: {
              container: [inputContainerDht],
              input: [inputDht]
            },
            children: <Thermometer className={thermometerIcon} />
          },
          {
            data: {
              type: 'range',
              minValue: MIN_HUMIDITY,
              maxValue: MAX_HUMIDITY,
              step: 1,
              defaultValue: deviceData.value.humidity.current,
              onInput: (event) => handleOnInput(event, 'humidity'),
              onTransformValue: () => transformHumidityValue(deviceData.value.humidity.current, MAX_HUMIDITY)
            },
            className: {
              container: [inputContainerDht],
              input: [inputDht]
            },
            children: <Drop className={dropIcon} />

          }
        ]}
      />

      <div
        className={deviceBody}
        ref={dragRef}
        onMouseEnter={() => onChangeActBtns(true)}
        onMouseLeave={() => onChangeActBtns(false)}
      >

        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />

        <ActionButtons
          orientation='left'
          active={activeActBtns}
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            typeContent: 'config-dht',
            onSave: handleSettingUpdate,
            data: {
              scaleTypeDefault: scaleType
            }
          }}
        />


      </div>

      <Connectors
        type='exits'
        exitConnectors={[
          {
            data: deviceData.connectors.temperature,
            device: {
              id,
              containerRef: device.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: handleSaveConnData
          },
          {
            data: deviceData.connectors.humidity,
            device: {
              id,
              containerRef: device.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: handleSaveConnData
          }
        ]}
      />

    </>
  );
});

Dht.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired
}

export default Dht;
