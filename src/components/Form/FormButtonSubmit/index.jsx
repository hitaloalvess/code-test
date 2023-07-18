import P from 'prop-types';

import * as F from './styles.module.css';

const FormButtonSubmit = ({ text, ...rest }) => {
  return (
    <button
      type='submit'
      className={F.buttonSubmit}
      {...rest}
    >
      <p>
        {text}
      </p>
    </button>
  );
};

FormButtonSubmit.propTypes = {
  text: P.string.isRequired,
}

export default FormButtonSubmit;
