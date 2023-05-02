import {
    menuButton,
    menuButtonActive
} from './styles.module.css';

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
            />
        </button>
    );
};

export default MenuButton;