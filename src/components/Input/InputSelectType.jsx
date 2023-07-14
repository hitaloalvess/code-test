
import P from 'prop-types';
import { CaretDown } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';
import { forwardRef, useMemo } from 'react';

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
        className={twMerge(`appearance-none absolute top-0 left-0 w-full h-full ${hasIconSibling ? 'px-[56px]' : 'px-[24px]'} bg-transparent uppercase outline-none rounded cursor-pointer focus:outline focus:outline-blue transition-[outline] duration-[450ms]`, rest.className)}
      >
        {
          optListTransform.map((option, index) => (
            <option
              key={index}
              value={index !== 0 ? option : ''}
              className={`appearance-none bg-gray-200`}
            >
              {option}
            </option>
          ))
        }

      </select>

      <CaretDown
        className='text-gray-100 ml-auto cursor-pointer transition-all duration-[450ms] hover:text-blue z-[1]'
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
