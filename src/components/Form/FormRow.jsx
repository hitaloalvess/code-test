
import P from 'prop-types';
import { twMerge } from 'tailwind-merge';

const FormRow = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(`grid grid-cols-1`, rest.className)}
    >
      {children}
    </div>
  );
};

FormRow.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default FormRow;
