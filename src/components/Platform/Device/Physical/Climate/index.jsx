import { memo, useState, useEffect, useMemo } from 'react';
import P from 'prop-types';
import { Thermometer, Drop } from '@phosphor-icons/react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { socketEvents } from '@/constants';
import { useContextAuth } from '@/hooks';
import {
  updateHardware,
  eventSubscribe,
  eventUnsubscribe,
} from '@/api/socket/hardware';
import { createHardwareConnection } from '@/api/http';
import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import * as PD from './styles.module.css';
import PhysicalParamsDisplay from '../../SharedDevice/PhysicalParamsDisplay';

const MAX_AIRUMID = 90;
const PhysicalClimate = memo(function Climate({
  data, dragRef, onSaveData
}) {
  const { id, imgSrc, name, posX, posY, isCreateFromSidebar } = data;

  const { person } = useContextAuth();

  const [scaleType, setScaleType] = useState('celsius');
  const [isConnected, setIsConnected] = useState(!!isCreateFromSidebar);

  const {
    executeFlow,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const transformationFormula = useMemo(() => {
    return formulasForTransformation[scaleType];
  }, [scaleType]);

  const handleSettingUpdate = (newScaleType) => {
    setScaleType(newScaleType);
  }

  const handleReceiveTelemetry = ({ telemetry }) => {
    const { airUmid, temp } = telemetry;

    const newValue = {
      temp: {
        ...data.value.temp,
        current: temp.toFixed(2)
      },
      airUmid: {
        ...data.value.airUmid,
        current: airUmid,
        max: MAX_AIRUMID
      }
    };

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue })
  }

  const handleDisconnect = () => {

    updateHardware({
      mac: id,
      userId: person.id,
      data: {
        events: {
          dashboard: false
        },
        user: {
          uuid: null
        }
      }
    });

    eventUnsubscribe(socketEvents.TELEMETRY(id, person.id));
  }

  useEffect(() => {
    eventSubscribe(socketEvents.TELEMETRY(id), handleReceiveTelemetry);

    return () => {
      handleDisconnect();
    }
  }, []);

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
      <div className={PD.showValueContainer}>
        <p
          className={PD.showValue}
        >
          {transformationFormula(data.value.temp.current)}

          <Thermometer className={PD.thermometerIcon} />
        </p>


        <p
          className={PD.showValue}
        >
          {transformHumidityValue(data.value.airUmid.current, MAX_AIRUMID)}

          <Drop className={PD.dropIcon} />
        </p>

      </div>

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        data-disable={!isConnected}
      >

        <ActionButtons
          orientation='left'
          actionConfig={{
            typeContent: 'config-climate',
            onSave: handleSettingUpdate,
            data: {
              scaleTypeDefault: scaleType
            }
          }}
          actionReconnect={{
            typeContent: 'connect-physical-device',
            onSave: async () => {
              await createHardwareConnection({ mac: id, userId: person.id });

              updateHardware({
                mac: id,
                userId: person.id,
                data: {
                  events: {
                    dashboard: true
                  }
                }
              });

              setIsConnected(true);

            },
            data: {
              mac: id
            }
          }}
        />

        <PhysicalParamsDisplay connectionState={isConnected} />

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
            handleChangeData: onSaveData,
          },
          {
            data: data.connectors.airUmid,
            device: {
              id,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData,
          }
        ]}
      />

    </>
  );
});

PhysicalClimate.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired,
}

export default PhysicalClimate;
