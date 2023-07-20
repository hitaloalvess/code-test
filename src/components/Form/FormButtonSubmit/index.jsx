import P from 'prop-types';

import * as F from './styles.module.css';

const FormButtonSubmit = ({ text, sizeW = 'large', ...rest }) => {
  const sizesW = (sizeW) => {
    const availableSizes = {
      'large': F.buttonSubmitLarge,
      'small': F.buttonSubmitSmall
    }

    return availableSizes[sizeW];
  }

  return (
    <button
      type='submit'
      className={`${F.buttonSubmit} ${sizesW(sizeW)}`}
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
  sizeW: P.oneOf(['large', 'small'])
}

export default FormButtonSubmit;
