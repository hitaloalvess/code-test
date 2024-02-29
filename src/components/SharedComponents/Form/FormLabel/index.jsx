import P from 'prop-types';

import * as L from './styles.module.css';

const FormLabel = ({ id, text }) => {
  return (
    <label
      htmlFor={id}
      className={L.labelText}
    >
      {text}
    </label>
  )
};

FormLabel.propTypes = {
  id: P.oneOfType([
    P.string,
    P.number
  ]).isRequired,
  text: P.string
}

export default FormLabel;
