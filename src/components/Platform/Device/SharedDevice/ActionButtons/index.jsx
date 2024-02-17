import P from 'prop-types';
import { Gear, Repeat, Trash } from '@phosphor-icons/react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButton from "./ActionButton";

import { useModal } from '@/hooks/useModal';

import * as AB from './styles.module.css';
import { memo, useMemo } from 'react';

const ActionButtons = memo(function ActionButtons
  ({ orientation = 'left', actionDelete = null, actionConfig = null, actionReconnect = null }) {

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
        `${AB.container} ${currentOrientation} ${AB.active}`
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

                if (actionDelete.onDelete) {
                  actionDelete.onDelete();
                }

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

      {
        actionReconnect && (
          <ActionButton
            onClick={
              () => enableModal({
                typeContent: actionReconnect.typeContent,
                title: 'Conectar dispositivo',
                subtitle: 'Insira as informações do dispositivo que deseja conectar',
                handleConfirm: async () => {
                  await actionReconnect.onSave()
                  disableModal(actionReconnect.typeContent)
                },
                data: actionReconnect.data
              })
            }
          >
            <Repeat />
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
    onDelete: P.func,
    data: P.shape({
      id: P.string.isRequired
    }).isRequired
  }),
  actionConfig: P.shape({
    onClick: P.func,
    typeContent: P.string,
    onSave: P.func,
    data: P.object
  }),
  actionReconnect: P.shape({
    onClick: P.func,
    typeContent: P.string,
    onSave: P.func,
    data: P.object
  })
}

export default ActionButtons;
