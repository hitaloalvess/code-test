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
  actionButtonsContainerLeft
} from '../../styles.module.css';

const MAX_VALUE = 1023;
const Potentiometer = memo(function Potentiometer({
  connRef, dragRef, device: { id, imgSrc, name, posX }
}) {
  const { deleteDevice } = useDevices();
  const { executeFlow, flows, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const inputRef = useRef(null);
  const showValueRef = useRef(null);

  const getResistance = () => {
    return {
      value: Number(inputRef.current.value),
      max: MAX_VALUE
    };
  }

  const handleOnInput = () => {
    const input = inputRef.current;
    showValueRef.current.innerHTML = input.value;

    executeFlow(flows, id, getResistance);
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

      <div>
        <Connector
          name={'luminosity'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getResistance
          }}
          updateConn={posX}
          refConn={connRef}

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

Potentiometer.propTypes = {
  connRef: P.object.isRequired,
  dragRef: P.func.isRequired,
  device: P.object.isRequired
}

export default Potentiometer;
