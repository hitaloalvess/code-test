import P from 'prop-types';

import { circleButtonContainer } from './styles.module.css';

const CircleButton = ({ name, imgSrc, handleClick, title, children }) => {
  return (
    <button className={circleButtonContainer}>
      <img
        src={imgSrc}
        alt={`Imagem do botão de ${name}`}
        loading='lazy'
        onClick={handleClick ? () => handleClick() : null}
        title={title}
      />

      {children}
    </button>
  );
};

CircleButton.propTypes = {
  name: P.string.isRequired,
  imgSrc: P.string.isRequired,
  handleClick: P.func,
  title: P.string,
  children: P.element
}

export default CircleButton;
