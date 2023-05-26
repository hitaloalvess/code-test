import { memo, useCallback, useEffect, useState } from 'react';
import P from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

import {
  deviceBody,
  actionButtonsContainer,
  actionButtonsContainerLeft
} from '../../styles.module.css';
import { findFlowByDeviceId } from '../../../../utils/flow-functions';

import switchOn from '@/assets/images/devices/entry/switchOn.svg';

const Switch = memo(function Switch({
  connRef, dragRef, device: { id, imgSrc, name, posX }
}) {
  const { deleteDevice } = useDevices();
  const { executeFlow, flows, deleteDeviceConnections } = useFlow();
  const { enableModal, disableModal } = useModal();
  const [click, setClick] = useState(false);

  const getBoolean = useCallback(() => {
    return {
      value: click,
    };
  }, [click])


  useEffect(() => {
    const existFlow = findFlowByDeviceId(flows, id)

    if (existFlow) {
      executeFlow(flows, id, getBoolean);
    }
  }, [click]);

  const handleOnClick = () => {
    setClick(prevClick => !prevClick);
  }

  return (
    <>
      <div
        className={deviceBody}
        ref={dragRef}
        onClick={handleOnClick}
      >
        <img
          src={click ? switchOn : imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div>
        <Connector
          name={'bool'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: getBoolean
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

Switch.propTypes = {
  connRef: P.object.isRequired,
  dragRef: P.func.isRequired,
  device: P.object.isRequired
}

export default Switch;
