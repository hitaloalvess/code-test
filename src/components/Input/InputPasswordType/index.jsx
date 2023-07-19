import P from 'prop-types';
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { forwardRef, useState } from "react";

import * as C from '@/styles/common.module.css';
import * as I from './styles.module.css';

const InputPasswordType = forwardRef(function InputPasswordType({
  hasIconSibling = true,
  defaultValue = '',
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
        defaultValue={defaultValue}
        ref={ref}
        {...rest}
        className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''}`}
      />

      {passwordIsVisible ?
        (
          <EyeSlash
            className={I.inputPasswordIcon}
            onClick={handleVisiblePassword}
          />
        ) :
        (
          <Eye
            className={I.inputPasswordIcon}
            onClick={handleVisiblePassword}
          />
        )}
    </>
  )
});

InputPasswordType.propTypes = {
  defaultValue: P.string,
  placeholder: P.string.isRequired,
  type: P.string,
  hasIconSibling: P.bool
}

export default InputPasswordType;
