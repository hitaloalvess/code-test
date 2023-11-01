import * as P from 'prop-types';
import { PlusCircle } from '@phosphor-icons/react';

import * as BC from './styles.module.css';

const ButtonConnect = ({ onOpenModal }) => {

  return (
    <button
      className={BC.btnConnectContainer}
      onClick={onOpenModal}
    >
      <PlusCircle className={BC.btnIcon} />
      Conectar hardware
    </button>
  );
};

ButtonConnect.propTypes = {
  onOpenModal: P.func.isRequired
}

export default ButtonConnect;
