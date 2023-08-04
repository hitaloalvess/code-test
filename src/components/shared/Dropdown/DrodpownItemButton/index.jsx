import P from 'prop-types';

import * as DB from './styles.module.css';

const DrodpdownItemButton = ({ handleClick, children }) => {
  return (
    <button
      className={DB.itemButton}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

DrodpdownItemButton.propTypes = {
  handleClick: P.func.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default DrodpdownItemButton;
