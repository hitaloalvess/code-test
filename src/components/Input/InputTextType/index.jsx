import P from 'prop-types';
import { forwardRef } from 'react';

import * as C from '../styles.module.css';

const InputTextType = forwardRef(function InputTextType({
  hasIconSibling = true,
  placeholder,
  defaultValue = '',
  ...rest
}, ref) {

  return (
    <input
      type={'text'}
      placeholder={placeholder}
      defaultValue={defaultValue}
      ref={ref}
      {...rest}
      className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''}`}
    />
  )
});

InputTextType.propTypes = {
  defaultValue: P.string,
  placeholder: P.string.isRequired,
  type: P.string,
  hasIconSibling: P.bool
}

export default InputTextType;
