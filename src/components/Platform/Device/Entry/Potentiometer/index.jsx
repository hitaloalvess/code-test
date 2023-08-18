import { memo, useEffect, useState } from 'react';
import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButton';
import Connector from '@/components/Platform/Connector';

import {
  deviceBody,
  inputRangeDeviceContainer,
  inputValue,
  actionButtonsContainer,
  actionButtonsContainerLeft,
  connectorsContainer,
  connectorsContainerExit
} from '../../styles.module.css';

const Potentiometer = memo(function Potentiometer({
  dragRef, device
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice, updateDeviceValue } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

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
    executeFlow({ connectorId: deviceData.connectors.resistance.id, fromBehaviorCallback: handleGetValue });

  }, [deviceData.value.current]);

  return (

    <>
      <div className={inputRangeDeviceContainer}
      >
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
                defaultBehavior: handleGetValue,
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

      </div>
    </>
  );
});

Potentiometer.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
}

export default Potentiometer;
