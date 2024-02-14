import { memo, useState, useEffect, useMemo, useRef } from 'react';
import P from 'prop-types';
import { Thermometer, Drop } from '@phosphor-icons/react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { socketEvents } from '@/constants';
import { useContextAuth } from '@/hooks';
import { updateHardwareEvents, eventSubscribe, eventUnsubscribe } from '@/api/socket/hardware';
import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import * as PD from './styles.module.css';
import PhysicalParamsDisplay from '../../SharedDevice/PhysicalParamsDisplay';

const MAX_HUMIDITY = 90;
const PhysicalClimate = memo(function Climate({
  data, dragRef, onSaveData
}) {
  const { id, imgSrc, name, posX, posY, mac } = data;
  const isFirstRender = useRef(true);
  const { person } = useContextAuth();
  const [scaleType, setScaleType] = useState('celsius');

  const {
    executeFlow,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const handleSettingUpdate = (newScaleType) => {
    setScaleType(newScaleType);
  }

  const transformationFormula = useMemo(() => {
    return formulasForTransformation[scaleType];
  }, [scaleType]);

  const handleReceiveTelemetry = ({ telemetry }) => {
    const { humidity, temperature } = telemetry;

    const newValue = {
      temperature: {
        ...data.value.temperature,
        current: temperature
      },
      humidity: {
        ...data.value.humidity,
        current: humidity,
        max: MAX_HUMIDITY
      }
    };

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue })
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    eventSubscribe(socketEvents.TELEMETRY(mac), handleReceiveTelemetry);

    return () => {
      updateHardwareEvents({
        mac,
        userId: person.id,
        events: {
          dashboard: false
        }
      })

      eventUnsubscribe(socketEvents.TELEMETRY(mac, person.id));
    }
  }, []);

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
      <div className={PD.showValueContainer}>
        <p
          className={PD.showValue}
        >
          {transformationFormula(data.value.temperature.current)}

          <Thermometer className={PD.thermometerIcon} />
        </p>


        <p
          className={PD.showValue}
        >
          {transformHumidityValue(data.value.humidity.current, MAX_HUMIDITY)}

          <Drop className={PD.dropIcon} />
        </p>

      </div>

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
            },
            onDelete: data.enablePhysicalDeviceInSidebar
          }}
          actionConfig={{
            typeContent: 'config-climate',
            onSave: handleSettingUpdate,
            data: {
              scaleTypeDefault: scaleType
            }
          }}
        />

        <PhysicalParamsDisplay connectionState={true} />

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

PhysicalClimate.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default PhysicalClimate;
