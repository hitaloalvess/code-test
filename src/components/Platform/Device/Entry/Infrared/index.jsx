import { memo, useState, useCallback, useEffect } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import ConfigInfraredModal from '@/components/SharedComponents/Modal/ConfigInfraredModal';

import * as I from './styles.module.css';


const Infrared = memo(function Infrared({
  data, dragRef, onSaveData
}) {

  const { id, imgSrc, name, posX, posY } = data;

  const {
    executeFlow,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleSettingUpdate = useCallback((newCode) => {
    const value = {
      code: {
        current: newCode
      }
    }

    onSaveData('value', { ...value });
    updateDeviceValue(id, { value })

  }, []);

  useEffect(() => {

    updateDeviceValueInFlow({ connectorId: data.connectors.code.id, newValue: data.value.code });

    executeFlow({ connectorId: data.connectors.code.id });
  }, [data.value.code.current]);

  return (
    <>
      <ConfigInfraredModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        handleUpdateCode={handleSettingUpdate}
      />

      <div className={I.showCodeContainer}
      >
        <p
          className={I.showCode}
        >{data.value.code.current}</p>
      </div>


      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >


        <ActionButtons
          orientation='left'
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            onClick: () => setIsModalOpen(!isModalOpen)
          }}
        />


      </DeviceBody>

      <Connectors
        type='exits'
        exitConnectors={[
          {
            data: data.connectors.code,
            device: {
              id,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          }
        ]}
      />
    </>
  );
});

Infrared.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  onSaveData: P.func.isRequired
}

export default Infrared;
