
import { memo, useRef, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButton';
import Connector from '@/components/Platform/Connector';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerRight,
  connectorsContainer,
  connectorsContainerEntry
} from '../../styles.module.css';

import {
  shake,
  numberValue
} from './styles.module.css';

const ShakeMotor = memo(function ShakeMotor({
  dragRef, device, updateValue
}) {
  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [value, setValue] = useState(device.value);
  const showValueRef = useRef(null);

  const defaultBehavior = (valueReceived) => {
    const { value: newValue, max } = valueReceived;

    const objValue = {
      current: typeof newValue === 'boolean' ?
        (newValue ? 1023 : 0) : newValue,
      max: typeof newValue === 'boolean' ? 1023 : max,
      type: typeof newValue
    }

    let active = false;
    if (objValue?.current !== 0) {
      active = true;
      const convertedValue = objValue.current * 100 / objValue.max;
      showValueRef.current.innerHTML = convertedValue.toFixed() + '%';

    } else {
      showValueRef.current.innerHTML = '0%';
    }

    updateValue(setValue, id, {
      ...objValue,
      active
    })
  }

  const redefineBehavior = () => {
    showValueRef.current.innerHTML = '0%';

    updateValue(setValue, id, {
      active: false,
      current: 0,
      max: 0,
      type: null
    })
  }

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
      >
        <p
          className={numberValue}
          ref={showValueRef}
        >
          0%
        </p>
        <img
          className={value.active ? shake : ''}
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>
      <div
        className={`${connectorsContainer} ${connectorsContainerEntry}`}
      >
        <Connector
          name={'boolean'}
          type={'entry'}
          device={{
            id,
            defaultBehavior,
            redefineBehavior,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
        />
      </div>

      <div
        className={
          `${actionButtonsContainer} ${actionButtonsContainerRight}`
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
      </div >
    </>
  );
});

ShakeMotor.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  updateValue: P.func.isRequired
}

export default ShakeMotor;
