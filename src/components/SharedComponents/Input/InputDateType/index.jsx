import P from 'prop-types';
import { forwardRef } from 'react';

import { formatInputDateDefaultValue } from '@/utils/form-validation-functions';

import * as C from '../styles.module.css';
import * as I from './styles.module.css';

const InputDateType = forwardRef(function InputDateType(
  { hasIconSibling = true, defaultValue = '', ...rest }, ref
) {

  return (
    <input
      ref={ref}
      {...rest}
      type="date"
      defaultValue={
        defaultValue ?
          formatInputDateDefaultValue(defaultValue) :
          ''
      }
      className={`${C.inputForm} ${!hasIconSibling ? C.hasNoInputIcon : ''} ${I.inputDate}`}
    />
  );
});

InputDateType.propTypes = {
  defaultValue: P.string,
  hasIconSibling: P.bool
}
export default InputDateType;
