import P from 'prop-types';
import { Gear, Trash } from '@phosphor-icons/react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButton from "./ActionButton";

import { useModal } from '@/hooks/useModal';

import * as AB from './styles.module.css';
import { memo, useMemo } from 'react';

const ActionButtons = memo(function ActionButtons
  ({ orientation = 'left', actionDelete = null, actionConfig = null }) {

  const { enableModal, disableModal } = useModal();

  const {
    deleteDeviceConnections,
  } = useStore(store => ({
    deleteDeviceConnections: store.deleteDeviceConnections,
  }), shallow);

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
        `${AB.container} ${currentOrientation} ${ AB.active }`
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
                deleteDeviceConnections({ deviceId: actionDelete.data.id });
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
});

ActionButtons.propTypes = {
  orientation: P.oneOf(['left', 'right', 'bottom']),
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
