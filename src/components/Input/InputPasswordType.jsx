import P from 'prop-types';
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";


const InputPasswordType = forwardRef(function InputPasswordType({
  hasIconSibling = true,
  placeholder,
  ...rest
}, ref) {

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const handleVisiblePassword = () => {
    setPasswordIsVisible(prevVisible => !prevVisible);
  }

  return (
    <>
      <input
        type={passwordIsVisible ? 'text' : 'password'}
        placeholder={placeholder}
        ref={ref}
        {...rest}
        className={twMerge(`absolute top-0 left-0 w-full h-full ${hasIconSibling ? 'px-[56px]' : 'px-[24px]'} bg-transparent outline-none rounded focus:outline focus:outline-blue transition-[outline] duration-[450ms]`, rest.className)}
      />

      {passwordIsVisible ?
        (
          <EyeSlash
            fontSize={20}
            className='text-gray-100 ml-auto cursor-pointer transition-all duration-[450ms] hover:text-blue z-[1]'
            onClick={handleVisiblePassword}
          />
        ) :
        (
          <Eye
            fontSize={20}
            className='text-gray-100 ml-auto cursor-pointer transition-all duration-[450ms] hover:text-blue z-[1]'
            onClick={handleVisiblePassword}
          />
        )}
    </>
  )
});

InputPasswordType.propTypes = {
  placeholder: P.string.isRequired,
  type: P.string,
  hasIconSibling: P.bool
}

export default InputPasswordType;
