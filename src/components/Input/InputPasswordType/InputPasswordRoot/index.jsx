import P from 'prop-types';
import { forwardRef } from "react";

import * as C from '../../styles.module.css';

const InputPasswordRoot = forwardRef(function InputPasswordRoot({
  hasIconSibling = true,
  defaultValue = '',
  placeholder,
  children,
  ...rest
}, ref) {



  return (
    <>
      <input
        type={'password'}
        placeholder={placeholder}
        defaultValue={defaultValue}
        ref={ref}
        {...rest}
        className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''}`}
      />

      {children}
    </>
  )
});

InputPasswordRoot.propTypes = {
  defaultValue: P.string,
  placeholder: P.string.isRequired,
  type: P.string,
  hasIconSibling: P.bool,
  children: P.element
}

export default InputPasswordRoot;
