import P from 'prop-types';

import {
  controlButton
} from './styles.module.css';


const InfraredButton = ({ color, text, value, handleButtonClick}) => {

  const handleClick = () => {
    handleButtonClick(value);
  }

  return (
      <button
      className={controlButton}
      style={{backgroundColor: color }}
      type="button"
      value="1"
      onClick = {handleClick}
      >
      {text ? text : value}
      </button>
  );
};


InfraredButton.propTypes = {
  className: P.string,
  handleButtonClick: P.func,
  value: P.string,
  text: P.string,
  color: P.string,
}


export default InfraredButton;
