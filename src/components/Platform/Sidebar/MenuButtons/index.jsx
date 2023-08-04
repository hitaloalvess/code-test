import { mockMenuButtons } from '@/data/sidebar.js';
import P from 'prop-types';

import MenuButton from '../MenuButton';

import { menuButtons } from './styles.module.css';

const MenuButtons = ({ handleSelectArea, area }) => {
  return (
    <div className={menuButtons}>
      <ul>
        {
          mockMenuButtons.map(({ id, imgSrc, typeArea }) => (
            <li key={id}>
              <MenuButton
                type={typeArea}
                src={imgSrc}
                active={typeArea === area}
                onClick={handleSelectArea}
              />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

MenuButtons.propTypes = {
  handleSelectArea: P.func.isRequired,
  area: P.string.isRequired
}

export default MenuButtons;
