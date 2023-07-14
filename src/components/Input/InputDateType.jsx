import P from 'prop-types';
import { forwardRef } from 'react';

import { twMerge } from "tailwind-merge";

const InputDateType = forwardRef(function InputDateType(
  { hasIconSibling = true, ...rest }, ref
) {

  return (
    <input
      ref={ref}
      {...rest}
      type="date"
      className={twMerge(`absolute text-gray-100 top-0 left-0 w-full h-full ${hasIconSibling ? 'px-[56px]' : 'px-[24px]'} bg-transparent outline-none rounded focus:outline focus:outline-blue transition-[outline] duration-[450ms]`, rest.className)}
    />
  );
});

InputDateType.propTypes = {
  hasIconSibling: P.bool
}
export default InputDateType;
