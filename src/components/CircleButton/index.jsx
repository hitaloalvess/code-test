import P from 'prop-types';

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

CircleButton.propTypes = {
  name: P.string.isRequired,
  imgSrc: P.string.isRequired,
  handleClick: P.func.isRequired
}

export default CircleButton;
