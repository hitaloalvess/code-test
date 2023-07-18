import P from 'prop-types';
import { forwardRef } from 'react';

import { applyMask } from '@/utils/form-validation-functions';

import * as C from '@/styles/common.module.css';

const InputTextMaskType = forwardRef(function InputTextType({
  name,
  hasIconSibling = true,
  placeholder,
  maskChange,
  ...rest
}, ref) {

  const handleChange = (event) => {
    const value = event.target.value;

    const valueTransform = applyMask(name, value)

    maskChange(name, valueTransform);
  }

  return (
    <input
      type={'text'}
      placeholder={placeholder}
      ref={ref}
      {...rest}
      className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''}`}
      onChange={handleChange}
    />
  )
});

InputTextMaskType.propTypes = {
  name: P.string.isRequired,
  placeholder: P.string.isRequired,
  type: P.string,
  maskChange: P.func.isRequired,
  hasIconSibling: P.bool
}

export default InputTextMaskType;
