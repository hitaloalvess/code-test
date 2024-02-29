import { useState } from 'react';
import P from 'prop-types';

import { Eye, EyeSlash } from "@phosphor-icons/react";

import * as I from './styles.module.css';

const InputPasswordIcon = () => {

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const handleVisiblePassword = (event) => {
    const input = event.target.previousSibling;

    setPasswordIsVisible(prevVisible => {
      const newValue = !prevVisible;
      input.type = newValue ? 'text' : 'password';

      return newValue;
    });
  }

  return (
    <>
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
  );
};

InputPasswordIcon.propTypes = {
  isVisible: P.bool,
}

export default InputPasswordIcon;
