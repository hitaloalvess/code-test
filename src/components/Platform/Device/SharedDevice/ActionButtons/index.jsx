import P from 'prop-types';

import { Gear, Trash } from '@phosphor-icons/react';

import ActionButton from "./ActionButton";
import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useModal } from '@/hooks/useModal';

import * as AB from './styles.module.css';
import { useMemo } from 'react';

const ActionButtons = ({ orientation = 'left', active, actionDelete = null, actionConfig = null }) => {

  const { enableModal, disableModal } = useModal();
  const { deleteDevice } = useDevices();
  const { deleteDeviceConnections } = useFlow();

  const currentOrientation = useMemo(() => {
    const orientations = {
      'left': AB.left,
      'right': AB.right,
      'bottom': AB.bottom
    }

    return orientations[orientation] || ''
  }, [orientation]);

  return (
    <div
      className={
        `${AB.container} ${currentOrientation} ${active ? AB.active : ''}`
      }
    >
      {
        actionDelete && (
          <ActionButton
            onClick={() => enableModal({
              typeContent: 'confirmation',
              title: actionDelete.title,
              subtitle: actionDelete.subtitle,
              handleConfirm: () => {
                deleteDeviceConnections(actionDelete.data.id);
                deleteDevice(actionDelete.data.id);
                disableModal('confirmation');
              }
            })}
          >
            <Trash />
          </ActionButton>
        )
      }



      {
        actionConfig && (
          <ActionButton
            onClick={actionConfig.onClick ?
              actionConfig.onClick :
              () => enableModal({
                typeContent: actionConfig.typeContent,
                handleSaveConfig: actionConfig.onSave,
                ...actionConfig.data
              })
            }
          >
            <Gear />
          </ActionButton>
        )
      }
    </div>
  );
};

ActionButtons.propTypes = {
  orientation: P.oneOf(['left', 'right', 'bottom']),
  active: P.bool.isRequired,
  actionDelete: P.shape({
    title: P.string.isRequired,
    subtitle: P.string.isRequired,
    data: P.shape({
      id: P.string.isRequired
    }).isRequired
  }),
  actionConfig: P.shape({
    onClick: P.func,
    typeContent: P.string,
    onSave: P.func,
    data: P.object
  })
}

export default ActionButtons;
