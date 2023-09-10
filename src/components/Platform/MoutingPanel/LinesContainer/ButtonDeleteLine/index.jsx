import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';

import { btnDeleteLine } from './styles.module.css';

import { useStore } from '@/store';
import { shallow } from 'zustand/shallow';


const ButtonDeleteLine = ({
  isActive, data: { idConnection, idLine }
}) => {

  const { deleteConnection } = useStore(store => {

    return {
      deleteConnection: store.deleteConnection
    }
  }, shallow);

  const handleDeleteLine = (e) => {
    e.stopPropagation();

    deleteConnection({ idConnection, idLine })
  }
  return (
    <button
      className={btnDeleteLine}
      onClick={handleDeleteLine}
      disabled={isActive}
    >
      <Trash />
    </button>
  );
};

ButtonDeleteLine.propTypes = {
  isActive: P.bool.isRequired,
  data: P.shape({
    idConnection: P.string.isRequired,
    idLine: P.string.isRequired
  })
}

export default ButtonDeleteLine;
