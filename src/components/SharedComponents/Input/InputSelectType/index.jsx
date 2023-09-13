
import P from 'prop-types';
import { CaretDown } from '@phosphor-icons/react';
import { forwardRef, useMemo } from 'react';

import * as C from '../styles.module.css';
import * as I from './styles.module.css';

const InputSelectType = forwardRef(function InputSelectType(
  {
    options,
    defaultOptTxt,
    defaultValue = '',
    hasIconSibling = true,
    ...rest
  },
  ref
) {

  const optListTransform = useMemo(() => {
    return [defaultOptTxt, ...options]
  }, [options]);

  return (
    <>
      <select
        ref={ref}
        defaultValue={defaultValue}
        {...rest}
        className={`${C.inputForm} ${I.selectInput} ${!hasIconSibling ? C.hasNoInputIcon : ''}`}
      >
        {
          optListTransform.map((option, index) => (
            <option
              key={index}
              value={index !== 0 ? option : ''}
              className={I.selectOpt}
            >
              {option}
            </option>
          ))
        }

      </select>

      <CaretDown
        className={I.selectIcon}
      />
    </>
  );
});

InputSelectType.propTypes = {
  defaultValue: P.string,
  options: P.array.isRequired,
  defaultOptTxt: P.string.isRequired,
  hasIconSibling: P.bool
}

export default InputSelectType;
