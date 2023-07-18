
import P from 'prop-types';
import { CaretDown } from '@phosphor-icons/react';
import { forwardRef, useMemo } from 'react';

import * as C from '@/styles/common.module.css';
import * as I from './styles.module.css';

const InputSelectType = forwardRef(function InputSelectType(
  { options, defaultOptTxt, hasIconSibling = true, ...rest }, ref
) {

  const optListTransform = useMemo(() => {
    return [defaultOptTxt, ...options]
  }, [options]);

  return (
    <>
      <select
        ref={ref}
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
  options: P.array.isRequired,
  defaultOptTxt: P.string.isRequired,
  hasIconSibling: P.bool
}

export default InputSelectType;
