import P from 'prop-types';
import { useState } from 'react';

import * as MB from './styles.module.css';

const MenuBurguerIcon = ({ onClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(prev => !prev);

    onClick();
  }

  return (
    <button
      className={MB.menuBurguer}
      onClick={handleClick}
    >
      <div className={`${MB.burguerIcon}  ${isActive ? MB.isActive : ''}`}></div>


    </button>
  );
};

MenuBurguerIcon.propTypes = {
  onClick: P.func.isRequired
}
export default MenuBurguerIcon;
