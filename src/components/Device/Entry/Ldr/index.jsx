import { memo, useRef } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

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
  device, dragRef
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice, updateDeviceValue } = useDevices();
  const { executeFlow, flows, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const inputRef = useRef(null);
  const showValueRef = useRef(null);

  const getLuminosity = () => {
    return {
      value: Number(inputRef.current.value),
      max: MAX_VALUE
    };
  }

  const handleOnInput = () => {
    const inputValue = Number(inputRef.current.value);
    showValueRef.current.innerHTML = inputValue;

    updateDeviceValue(id, {
      value: {
        current: inputValue,
        max: MAX_VALUE
      }
    });

    executeFlow(flows, id, getLuminosity);
  }

  return (

    <>

      <div className={inputRangeDeviceContainer}
      >
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
            defaultBehavior: getLuminosity
          }}
          updateConn={{ posX, posY }}
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
              disableModal();
            }
          })}
        >
          <FaTrashAlt />
        </ActionButton>

      </div>
    </>
  );
});

Ldr.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired
}

export default Ldr;
