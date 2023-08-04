import { memo, useRef, useState } from 'react';
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
const Ldr = memo(function Ldr({
  device, dragRef, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [lumenConnectorId, setLumenConnectorId] = useState('');

  const inputRef = useRef(null);

  const showValueRef = useRef(null);

  const getLuminosity = () => {
    return {
      value: Number(inputRef.current.value),
      max: MAX_VALUE
    };
  }

  const handleOnInput = () => {
    const temperatureValue = Number(inputRef.current.value);

    showValueRef.current.innerHTML = temperatureValue;

    updateValue(null, id, {
      current: temperatureValue,
      max: MAX_VALUE
    });

    executeFlow({ connectorId: lumenConnectorId, fromBehaviorCallback: getLuminosity });
  }

  const handleChangeLumenConnector = (value) => {
    setLumenConnectorId(value);
  }

  return (

    <>

      <div className={inputRangeDeviceContainer}>
        <input
          type="range"
          min="0"
          max="1023"
          step="1"
          defaultValue={0}
          onInput={handleOnInput}
          ref={inputRef}
        />
        <p
          className={inputValue}
          ref={showValueRef}
        >0</p>
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
          name={'luminosity'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getLuminosity,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeLumenConnector}
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

Ldr.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Ldr;