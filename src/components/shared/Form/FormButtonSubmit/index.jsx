import P from 'prop-types';

import * as F from './styles.module.css';

const FormButtonSubmit = ({ sizeW = 'large', children, ...rest }) => {
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
      {children}
    </button>
  );
};

FormButtonSubmit.propTypes = {
  children: P.oneOfType([
    P.string,
    P.element
  ]),
  sizeW: P.oneOf(['large', 'small'])
}

export default FormButtonSubmit;
