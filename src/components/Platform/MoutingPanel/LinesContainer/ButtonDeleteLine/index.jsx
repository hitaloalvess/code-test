import P from 'prop-types';
import { Trash } from '@phosphor-icons/react';

import { btnDeleteLine } from './styles.module.css';

const ButtonDeleteLine = ({
  isActive, deleteLine, data: { idConnection, idLine }
}) => {

  const handleDeleteLine = (e) => {
    e.stopPropagation();
    deleteLine({ idConnection, idLine })
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
  deleteLine: P.func.isRequired,
  data: P.shape({
    idConnection: P.string.isRequired,
    idLine: P.string.isRequired
  })
}

export default ButtonDeleteLine;
