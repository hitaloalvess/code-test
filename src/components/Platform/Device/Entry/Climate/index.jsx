import { memo, useState, useEffect, useMemo } from 'react';
import P from 'prop-types';
import { Thermometer, Drop } from '@phosphor-icons/react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';
import DeviceBody from '../../SharedDevice/DeviceBody';

import {
  thermometerIcon,
  dropIcon,
  inputClimate,
  inputContainerClimate
} from './styles.module.css';

const MAX_TEMPERATURE = 50;
const MIN_TEMPERATURE = -50;
const MAX_HUMIDITY = 1023;
const MIN_HUMIDITY = 0;

const Climate = memo(function Climate({
  data, dragRef, onSaveData
}) {

  const { id, imgSrc, name, posX, posY } = data;

  const {
    executeFlow,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [scaleType, setScaleType] = useState('celsius');

  const transformationFormula = useMemo(() => {
    return formulasForTransformation[scaleType];
  }, [scaleType]);


  const handleSettingUpdate = (newScaleType) => {
    setScaleType(newScaleType);
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

    updateDeviceValueInFlow({ connectorId: data.connectors.temperature.id, newValue: data.value.temperature });

    executeFlow({ connectorId: data.connectors.temperature.id });

  }, [data.value.temperature.current]);

  useEffect(() => {

    updateDeviceValueInFlow({ connectorId: data.connectors.humidity.id, newValue: data.value.humidity });

    executeFlow({ connectorId: data.connectors.humidity.id });
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
              container: [inputContainerClimate],
              input: [inputClimate]
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
              container: [inputContainerClimate],
              input: [inputClimate]
            },
            children: <Drop className={dropIcon} />

          }
        ]}
      />

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >


        <ActionButtons
          orientation='left'
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            typeContent: 'config-climate',
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

Climate.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Climate;
