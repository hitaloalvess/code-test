import P from 'prop-types';
import { forwardRef } from 'react';

import * as C from '@/styles/common.module.css';
import * as I from './styles.module.css';

const InputDateType = forwardRef(function InputDateType(
  { hasIconSibling = true, ...rest }, ref
) {

  return (
    <input
      ref={ref}
      {...rest}
      type="date"
      className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''} ${I.inputDate}`}
    />
  );
});

InputDateType.propTypes = {
  hasIconSibling: P.bool
}
export default InputDateType;
