import { memo, useRef } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import { useDrag } from 'react-dnd';

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
} from '../styles.module.css';

const MAX_VALUE = 1023;
const Ldr = memo(function Ldr({
  id, imgSrc, name, ...device
}) {
  const { deleteDevice } = useDevices();
  const { executeFlow } = useFlow();
  const { enableModal, disableModal } = useModal();

  const inputRef = useRef(null);
  const showValueRef = useRef(null);
  const connRef = useRef(null);

  const defaultBehavior = () => {
    return {
      value: Number(inputRef.current.value),
      max: MAX_VALUE
    };
  }

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'device',
    item: {
      ...device,
      id,
      imgSrc,
      name,
      connRef,
    },
  }), [connRef]);

  const handleOnInput = () => {
    const input = inputRef.current;
    showValueRef.current.innerHTML = input.value;

    executeFlow(id);
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
        ref={drag}
      >
        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div>
        <Connector
          type={'exit'}
          device={{
            id,
            defaultBehavior
          }}
          updateConn={device.posX}
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
  id: P.string.isRequired,
  name: P.string.isRequired,
  imgSrc: P.string.isRequired,
  type: P.string,
  category: P.string,
  posX: P.number,
  posY: P.number,
  draggedDevice: P.object,
}

export default Ldr;
