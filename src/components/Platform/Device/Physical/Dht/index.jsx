import { memo, useState, useEffect, useMemo, useRef } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';
import { Thermometer, Drop } from '@phosphor-icons/react';

import { useAuth } from '@/hooks/useAuth';
import { socket } from '@/services/websocket';
import { useStore } from '@/store';
import { formulasForTransformation, transformHumidityValue } from '@/utils/devices-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import * as PD from './styles.module.css';

const MAX_HUMIDITY = 1023;
const PhysicalDht = memo(function Dht({
  data, dragRef, onSaveData
}) {
  const isFirstRender = useRef(true);
  const { user } = useAuth();
  const { id, imgSrc, name, posX, posY , mac } = data;

  const {
    executeFlow,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [scaleType, setScaleType] = useState('celsius');

  const handleSettingUpdate = (newScaleType) => {
    setScaleType(newScaleType);
  }

  const transformationFormula = useMemo(() => {
    return formulasForTransformation[scaleType];
  }, [scaleType]);


  useEffect(() => {

    socket.emit('sensor/update/activation', {
      mac, cpf: user.cpf, active: true
    });

    // socket.on(`${user.cpf}/sensor/${typeId}/${mac}`, (data) => {
    //   console.log({ data });
    // })

    return () => {
      socket.emit('sensor/update/activation', {
        mac, cpf: user.cpf, active: false
      })
    }
  }, []);

  useEffect(() => {
    if(isFirstRender.current){
      isFirstRender.current = false;

      return;
    }

    updateDeviceValueInFlow({ connectorId: data.connectors.temperature.id, newValue: data.value.temperature });

    executeFlow({ connectorId: data.connectors.temperature.id });

  }, [data.value.temperature.current]);

  useEffect(() => {
    if(isFirstRender.current){
      isFirstRender.current = false;

      return;
    }

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

            <Thermometer className={PD.thermometerIcon}/>
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

PhysicalDht.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default PhysicalDht;
