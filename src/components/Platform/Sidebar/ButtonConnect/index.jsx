import { PlusCircle } from '@phosphor-icons/react';

import { createHardwareConnection } from '@/api/http';
import { useContextAuth, useModal, useSidebar } from '@/hooks'

import * as BC from './styles.module.css';

const ButtonConnect = () => {

  const { enableModal, disableModal } = useModal();
  const { person } = useContextAuth();
  const { handleCreatePhysicalDevice } = useSidebar();

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: async ({ mac }) => {
        const { hardware: { config } } = await createHardwareConnection({ mac, userId: person.id });
        handleCreatePhysicalDevice({ mac: config.mac, type: config.type });

        disableModal();
      }
    })
  }

  return (
    <button
      className={BC.btnConnectContainer}
      onClick={handleOpenModal}
    >
      <PlusCircle className={BC.btnIcon} />
      Conectar hardware
    </button>
  );
};


export default ButtonConnect;
