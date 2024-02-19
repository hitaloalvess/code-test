import { mockMenuButtons } from '@/data/sidebar.js';
import { useSidebar } from '@/hooks/useSidebar';

import MenuButton from '../MenuButton';

import { menuButtons } from './styles.module.css';

const MenuButtons = () => {
  const { handleSelectArea, currentArea } = useSidebar();

  return (
    <div className={menuButtons}>
      <ul>
        {
          mockMenuButtons.map(({ id, imgSrc, typeArea, title }) => (
            <li key={id}>
              <MenuButton
                type={typeArea}
                src={imgSrc}
                active={typeArea === currentArea}
                onClick={handleSelectArea}
                textTitle={title}
              />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default MenuButtons;
