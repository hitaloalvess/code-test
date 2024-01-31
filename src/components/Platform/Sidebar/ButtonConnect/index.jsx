import { PlusCircle } from '@phosphor-icons/react';

import { socket } from '@/services/websocket';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/hooks/useAuth';

import * as BC from './styles.module.css';

const ButtonConnect = () => {

  const { enableModal } = useModal();
  const { user } = useAuth();

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: (data) => {
        socket.emit('sensor/register', {
          cpf: user.cpf,
          ...data
        });
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
