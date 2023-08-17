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

const MAX_VALUE = 1023;
const Potentiometer = memo(function Potentiometer({
  dragRef, device
}) {


  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice, updateDeviceValue } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const [connectorId, setConnectorId] = useState('');


  const getResistance = () => {

    return {
      value: value.current,
      max: MAX_VALUE
    };
  }

  const handleOnInput = (event) => {
    const value = event.target.value;


    setValue({
      current: Number(value),
      max: MAX_VALUE
    })

    updateDeviceValue(id, {
      value: {
        current: Number(value),
        max: MAX_VALUE
      }
    })
  }

  const handleChangeConnector = (value) => {
    setConnectorId(value);
  }

  useEffect(() => {
    executeFlow({ connectorId, fromBehaviorCallback: getResistance });

  }, [value]);

  return (

    <>
      <div className={inputRangeDeviceContainer}
      >
        <input
          type="range"
          min="0"
          max="1023"
          step="1"
          defaultValue={value.current}
          onInput={handleOnInput}
        />
        <p
          className={inputValue}
        >{value.current}</p>
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
        <Connector
          data={{
            id: '',
            name: 'resistance',
            type: 'exit'
          }}
          device={{
            id,
            defaultBehavior: getResistance,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeConnector}
        />
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
