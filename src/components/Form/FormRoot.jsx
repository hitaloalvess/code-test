
import P from 'prop-types';
import { twMerge } from 'tailwind-merge';

const FormRoot = ({ onSubmit, children, ...rest }) => {
  return (
    <form
      {...rest}
      onSubmit={onSubmit}
      className={twMerge('w-[420px] flex flex-col gap-[32px]', rest.className)}
    >
      {children}
    </form>
  )
};

FormRoot.propTypes = {
  onSubmit: P.func.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default FormRoot;
