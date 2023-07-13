import P from 'prop-types';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

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
      className={twMerge(`absolute top-0 left-0 w-full h-full ${hasIconSibling ? 'px-[56px]' : 'px-[24px]'} bg-transparent outline-none rounded focus:outline focus:outline-blue transition-[outline] duration-[450ms]`, rest.className)}
    />
  )
});

InputTextType.propTypes = {
  placeholder: P.string.isRequired,
  type: P.string,
  hasIconSibling: P.bool
}

export default InputTextType;
