import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';

import { btnDeleteLine } from './styles.module.css';

import { useStore } from '@/store';
import { shallow } from 'zustand/shallow';
import { memo } from 'react';


const ButtonDeleteLine = memo(function ButtonDeleteLine({
  data: { idConnection, idLine }
}) {

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
    >
      <Trash />
    </button>
  );
});

ButtonDeleteLine.propTypes = {
  data: P.shape({
    idConnection: P.string,
    idLine: P.string.isRequired
  })
}

export default ButtonDeleteLine;
