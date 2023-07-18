import P from 'prop-types';
import { forwardRef } from 'react';

import * as C from '@/styles/common.module.css';

const InputTextType = forwardRef(function InputTextType({
  hasIconSibling = true,
  placeholder,
  ...rest
}, ref) {

  return (
    <input
      type={'text'}
      placeholder={placeholder}
      ref={ref}
      {...rest}
      className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''}`}
    />
  )
});

InputTextType.propTypes = {
  placeholder: P.string.isRequired,
  type: P.string,
  hasIconSibling: P.bool
}

export default InputTextType;
