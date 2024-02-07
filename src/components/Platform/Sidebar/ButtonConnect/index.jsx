import { PlusCircle } from '@phosphor-icons/react';

import { useHardwareCommunication, useContextAuth, useModal, useSidebar } from '@/hooks'

import * as BC from './styles.module.css';

const ButtonConnect = () => {

  const { enableModal, disableModal } = useModal();
  const { person } = useContextAuth();
  const { connectHardware } = useHardwareCommunication();
  const { handleCreatePhysicalDevice } = useSidebar();

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: async ({ mac }) => {
        const { device } = await connectHardware({ mac, userId: person.id });

        disableModal();

        const { config } = device;
        handleCreatePhysicalDevice({ mac: config.mac, type: config.type });
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
