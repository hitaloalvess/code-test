import P from 'prop-types';

import * as I from './styles.module.css';

const InputPasswordButton = ({ text, handleClick }) => {
  return (
    <button
      className={I.inputPasswordButton}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

InputPasswordButton.propTypes = {
  text: P.string.isRequired,
  handleClick: P.func.isRequired
}

export default InputPasswordButton;
