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

const MAX_TEMP = 50;
const MIN_TEMP = -50;
const MAX_AIRUMID = 1023;
const MIN_AIRUMID = 0;

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

    updateDeviceValueInFlow({ connectorId: data.connectors.temp.id, newValue: data.value.temp });

    executeFlow({ connectorId: data.connectors.temp.id });

  }, [data.value.temp.current]);

  useEffect(() => {

    updateDeviceValueInFlow({ connectorId: data.connectors.airUmid.id, newValue: data.value.airUmid });

    executeFlow({ connectorId: data.connectors.airUmid.id });
  }, [data.value.airUmid.current]);

  return (

    <>

      <DeviceInputs
        inputs={[
          {
            data: {
              minValue: MIN_TEMP,
              maxValue: MAX_TEMP,
              step: 0.1,
              defaultValue: data.value.temp.current,
              onInput: (event) => handleOnInput(event, 'temp'),
              onTransformValue: () => transformationFormula(data.value.temp.current)
            },
            className: {
              container: [inputContainerClimate],
              input: [inputClimate]
            },
            children: <Thermometer className={thermometerIcon} />
          },
          {
            data: {
              minValue: MIN_AIRUMID,
              maxValue: MAX_AIRUMID,
              step: 1,
              defaultValue: data.value.airUmid.current,
              onInput: (event) => handleOnInput(event, 'airUmid'),
              onTransformValue: () => transformHumidityValue(data.value.airUmid.current, MAX_AIRUMID)
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
            data: data.connectors.temp,
            device: {
              id,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
          {
            data: data.connectors.airUmid,
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
