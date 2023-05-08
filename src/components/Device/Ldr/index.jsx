import { memo, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { FaTrashAlt } from 'react-icons/fa';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

import {
  deviceBody,
  inputRangeDeviceContainer,
  inputValue,
  actionButtonsContainer,
  actionButtonsContainerLeft
} from '../styles.module.css';

const Ldr = memo(function Ldr({ imgSrc, name, ...device }) {
  const inputRef = useRef(null);
  const showValueRef = useRef(null);

  const { deleteDevice } = useDevices();
  const { enableModal, disableModal } = useModal();

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'device',
    item: { imgSrc, name, ...device }
  }), []);

  const handleOnInput = () => {
    const input = inputRef.current;

    showValueRef.current.innerHTML = input.value;
  }

  return (

    <>
      <div className={inputRangeDeviceContainer}>
        <input
          type="range"
          min="0"
          max="1023"
          step="1"
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
        ref={drag}
      >
        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div>
        <Connector type={'exit'} />
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
              deleteDevice(device.id);
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
  id: P.string.isRequired,
  name: P.string.isRequired,
  imgSrc: P.string.isRequired,
  type: P.string,
  category: P.string,
  posX: P.number,
  posY: P.number,
  draggedDevice: P.object
}

export default Ldr;
