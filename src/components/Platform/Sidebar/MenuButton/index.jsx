import {
  menuButton,
  menuButtonActive
} from './styles.module.css';
import P from 'prop-types';

const MenuButton = ({ type, src, active, onClick }) => {
  return (
    <button

      className={`${menuButton} ${active ? menuButtonActive : ''}`}
      onClick={() => onClick(type)}
    >
      <img
        src={src}
        alt={`Botão para seção de componentes de ${type}`}
        loading='lazy'
        draggable={false}
      />
    </button>
  );
};

MenuButton.propTypes = {
  type: P.string.isRequired,
  src: P.string.isRequired,
  active: P.bool.isRequired,
  onClick: P.func.isRequired
}

export default MenuButton;
