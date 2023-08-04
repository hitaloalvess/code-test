import { memo, useRef, useState, useCallback } from 'react';
import P from 'prop-types';
import { Trash, Gear } from '@phosphor-icons/react';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButton';
import Connector from '@/components/Platform/Connector';
import ConfigInfraredModal from '@/components/shared/Modal/ConfigInfraredModal';

import {
  deviceBody,
  inputRangeDeviceContainer,
  actionButtonsContainer,
  actionButtonsContainerLeft,
  connectorsContainer,
  connectorsContainerExit
} from '../../styles.module.css';

import {
  showCode
} from './styles.module.css'


const Infrared = memo(function Infrared({
  device, dragRef, updateValue
}) {

  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { executeFlow, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();
  const [connectorId, setConnectorId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [code, setNewCode] = useState('FF12F3');

  const showValueRef = useRef(null);

  const getCode = () => {
    return {
      value: code,
    };
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleSettingUpdate = useCallback((newCode) => {
    showValueRef.current.innerHTML = newCode;
    setNewCode(newCode);
    updateValue(null, id, newCode);

    executeFlow({ connectorId, fromBehaviorCallback: getCode });
  }, [code]);


  const handleChangeConnector = (value) => {
    setConnectorId(value);
  }

  return (
    <>
      <ConfigInfraredModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        handleUpdateCode={handleSettingUpdate}
      />

      <div className={inputRangeDeviceContainer}
      >
        <p
          className={showCode}
          ref={showValueRef}
        >{code}</p>
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
          name={'code'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getCode,
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

        <ActionButton
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <Gear />
        </ActionButton>

      </div>
    </>
  );
});

Infrared.propTypes = {
  device: P.object.isRequired,
  dragRef: P.func.isRequired,
  updateValue: P.func.isRequired
}

export default Infrared;
