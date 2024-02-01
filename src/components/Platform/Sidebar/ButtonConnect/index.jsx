import { PlusCircle } from '@phosphor-icons/react';

import { useHardwareCommunication, useAuth, useModal } from '@/hooks'

import * as BC from './styles.module.css';

const ButtonConnect = () => {

  const { enableModal } = useModal();
  const { user } = useAuth();
  const { connectHardware } = useHardwareCommunication();

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: ({ mac }) => connectHardware({ mac, userId: user.id })
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
