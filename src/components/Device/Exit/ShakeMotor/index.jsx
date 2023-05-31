
import { memo, useRef, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

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
  dragRef, device
}) {
  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();

  const [motorActive, setMotorActive] = useState(false);
  const [, setValue] = useState({
    current: 0,
    max: 0,
    type: null
  });
  const showValueRef = useRef(null);


  const enableShake = () => {
    setMotorActive(true);
  }

  const disableShake = () => {
    setMotorActive(false);
  }


  const defaultBehavior = (valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      value: typeof value === 'boolean' ?
        (value ? 1023 : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value
    }

    if (objValue?.value !== 0) {
      enableShake();
      const convertedValue = objValue.value * 100 / objValue.max;
      showValueRef.current.innerHTML = convertedValue.toFixed() + '%';

    } else {
      disableShake();
      showValueRef.current.innerHTML = '0%';
    }
    setValue(objValue);
  }

  const redefineBehavior = () => {
    showValueRef.current.innerHTML = '0%',
      setMotorActive(false),
      setValue({
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
          className={motorActive ? shake : ''}
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
            redefineBehavior
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
  device: P.object.isRequired
}

export default ShakeMotor;
