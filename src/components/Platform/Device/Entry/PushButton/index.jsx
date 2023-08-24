import { memo, useCallback, useEffect, useState } from 'react';
import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/Platform/ActionButtons/ActionButton';
import Connector from '@/components/Platform/Connector';

import pushButtonOn from '@/assets/images/devices/entry/pushButtonOn.svg';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerLeft,
  connectorsContainer,
  connectorsContainerExit
} from '../../styles.module.css';


const PushButton = memo(function PushButton({
  dragRef, device, updateValue
}) {
  const { id, imgSrc, name, posX, posY } = device;
  const { deleteDevice } = useDevices();
  const { executeFlow, flows, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();
  const [click, setClick] = useState(device.value);
  const [connectorId, setConnectorId] = useState('');

  const getBoolean = useCallback(() => {
    return {
      value: click,
    };
  }, [click])


  useEffect(() => {
    const existFlow = findFlowsByDeviceId(flows, id);

    if (existFlow) {
      executeFlow({ connectorId, fromBehaviorCallback: getBoolean });
    }
  }, [click]);

  const handleOnClickUp = () => updateValue(setClick, id, false);

  const handleOnClickDown = () => updateValue(setClick, id, true);

  const handleChangeConnector = (value) => {
    setConnectorId(value);
  }

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
        onMouseUp={handleOnClickUp}
        onMouseDown={handleOnClickDown}
        onDragEnd={handleOnClickUp}
        onTouchStart={handleOnClickDown}
        onTouchEnd={handleOnClickUp}
      >
        <img
          src={click ? pushButtonOn : imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerExit}`}
      >
        <Connector
          name={'bool'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getBoolean,
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

PushButton.propTypes = {
  dragRef: P.func.isRequired,
  device: P.object.isRequired,
  updateValue: P.func.isRequired
}

export default PushButton;
