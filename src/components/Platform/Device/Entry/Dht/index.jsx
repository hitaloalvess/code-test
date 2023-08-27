import { memo, useState, useEffect, useMemo } from 'react';
import P from 'prop-types';
import { Thermometer, Drop } from '@phosphor-icons/react';

import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';
import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';
import DeviceBody from '../../SharedDevice/DeviceBody';

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
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) {

  const { id, imgSrc, name, posX, posY } = data;
  const { updateDeviceValue } = useDevices();
  const { executeFlow, updateDeviceValueInFlow } = useFlow();

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
        value: data.value.temperature.current,
        max: MAX_TEMPERATURE
      };
    }

    if (typeValue === 'humidity') {
      return {
        value: data.value.humidity.current,
        max: MAX_HUMIDITY
      };
    }

  }

  const handleOnInput = (event, name) => {
    const inputValue = Number(event.target.value);

    const value = {
      ...data.value,
      [`${name}`]: {
        ...data.value[`${name}`],
        current: inputValue,
      }
    }

    onSaveData('value', value);

    updateDeviceValue(id, { value })

  }


  useEffect(() => {
    updateDeviceValue(id, {
      defaultBehavior: () => handleGetValue('temperature')
    });

    updateDeviceValueInFlow({ connectorId: data.connectors.temperature.id, newValue: data.value.temperature });

    executeFlow({ connectorId: data.connectors.temperature.id, fromBehaviorCallback: () => handleGetValue(data.connectors.temperature.name) });

  }, [data.value.temperature.current]);

  useEffect(() => {
    updateDeviceValue(id, {
      defaultBehavior: () => handleGetValue('humidity')
    });

    updateDeviceValueInFlow({ connectorId: data.connectors.humidity.id, newValue: data.value.humidity });

    executeFlow({ connectorId: data.connectors.humidity.id, fromBehaviorCallback: () => handleGetValue(data.connectors.humidity.name) });
  }, [data.value.humidity.current]);

  return (

    <>

      <DeviceInputs
        inputs={[
          {
            data: {
              minValue: MIN_TEMPERATURE,
              maxValue: MAX_TEMPERATURE,
              step: 0.1,
              defaultValue: data.value.temperature.current,
              onInput: (event) => handleOnInput(event, 'temperature'),
              onTransformValue: () => transformationFormula(data.value.temperature.current)
            },
            className: {
              container: [inputContainerDht],
              input: [inputDht]
            },
            children: <Thermometer className={thermometerIcon} />
          },
          {
            data: {
              minValue: MIN_HUMIDITY,
              maxValue: MAX_HUMIDITY,
              step: 1,
              defaultValue: data.value.humidity.current,
              onInput: (event) => handleOnInput(event, 'humidity'),
              onTransformValue: () => transformHumidityValue(data.value.humidity.current, MAX_HUMIDITY)
            },
            className: {
              container: [inputContainerDht],
              input: [inputDht]
            },
            children: <Drop className={dropIcon} />

          }
        ]}
      />

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >


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


      </DeviceBody>


      <Connectors
        type='exits'
        exitConnectors={[
          {
            data: data.connectors.temperature,
            device: {
              id,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
          {
            data: data.connectors.humidity,
            device: {
              id,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          }
        ]}
      />

    </>
  );
});

Dht.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Dht;
