import P from 'prop-types';

import * as MB from './styles.module.css';

const MenuBurguerIcon = ({ onClick, isActive }) => {

  return (
    <button
      className={MB.menuBurguer}
      onClick={onClick}
    >
      <div className={`${MB.burguerIcon}  ${isActive ? MB.isActive : ''}`}></div>


    </button>
  );
};

MenuBurguerIcon.propTypes = {
  onClick: P.func.isRequired,
  isActive: P.bool.isRequired
}
export default MenuBurguerIcon;
