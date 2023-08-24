import { memo, useEffect, useState } from 'react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import Connector from '@/components/Platform/Connector';
import ActionButtons from '@/components/Platform/ActionButtons';

import {
  deviceBody,
  inputRangeDeviceContainer,
  inputValue,
  connectorsContainer,
  connectorsContainerExit
} from '../../styles.module.css';

const Potentiometer = memo(function Potentiometer({
  dragRef, device, activeActBtns, onChangeActBtns
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { updateDeviceValue } = useDevices();
  const { executeFlow, updateDeviceValueInFlow } = useFlow();


  const [deviceData, setDeviceData] = useState(device);


  const handleGetValue = () => {
    return {
      value: deviceData.value.current,
      max: deviceData.value.max
    }
  };

  const handleOnInput = (event) => {
    const inputValue = Number(event.target.value);

    const value = {
      ...deviceData.value,
      current: inputValue,
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
    });
  }, [deviceData.connectors]);

  useEffect(() => {
    updateDeviceValue(id, {
      defaultBehavior: handleGetValue
    });

    updateDeviceValueInFlow({ connectorId: deviceData.connectors.resistance.id, newValue: deviceData.value })

    executeFlow({ connectorId: deviceData.connectors.resistance.id });

  }, [deviceData.value.current]);

  return (

    <>
      <div className={inputRangeDeviceContainer}>
        <input
          type="range"
          min="0"
          max="1023"
          step="1"
          defaultValue={deviceData.value.current}
          onInput={handleOnInput}
        />
        <p
          className={inputValue}
        >{deviceData.value.current}</p>
      </div>

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
                containerRef: device.containerRef
              }}
              updateConn={{ posX, posY }}
              handleChangeData={handleSaveConnData}
            />
          ))
        }
      </div>

    </>
  );
});

Potentiometer.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired
}

export default Potentiometer;
