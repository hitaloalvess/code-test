import { PlusCircle } from '@phosphor-icons/react';

import { useHardwareCommunication, useContextAuth, useModal } from '@/hooks'

import * as BC from './styles.module.css';

const ButtonConnect = () => {

  const { enableModal } = useModal();
  const { person } = useContextAuth();
  const { connectHardware } = useHardwareCommunication();

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: ({ mac }) => connectHardware({ mac, userId: person.id })
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
