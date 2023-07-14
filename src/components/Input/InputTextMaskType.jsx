import P from 'prop-types';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { applyMask } from '@/utils/form-validation-functions';

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
      className={twMerge(`absolute top-0 left-0 w-full h-full ${hasIconSibling ? 'px-[56px]' : 'px-[24px]'} bg-transparent outline-none rounded focus:outline focus:outline-blue transition-[outline] duration-[450ms]`, rest.className)}
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
