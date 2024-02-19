import { PlusCircle } from '@phosphor-icons/react';

import { createHardwareConnection } from '@/api/http';
import { useContextAuth, useModal, useSidebar } from '@/hooks'

import * as BC from './styles.module.css';
import { toast } from 'react-toastify';

const ButtonConnect = () => {

  const { enableModal, disableModal } = useModal();
  const { person } = useContextAuth();
  const { handleCreatePhysicalDevice, devices } = useSidebar();

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-physical-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: async ({ mac }) => {

        const hasHardware = devices.hardware.find(hardware => hardware.id === mac)

        if (hasHardware) {
          toast.warning(`Já existe um dispositivo criado com esse endereço mac`)
          return;
        }

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
