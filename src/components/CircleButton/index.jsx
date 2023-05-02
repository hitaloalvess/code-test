import { circleButtonContainer } from './styles.module.css';

const CircleButton = ({ name, imgSrc, handleClick }) => {
    return (
        <button className={circleButtonContainer}>
            <img
                src={imgSrc}
                alt={`Imagem do botão de ${name}`}
                loading='lazy'
                onClick={() => handleClick()}
            />
        </button>
    );
};

export default CircleButton;