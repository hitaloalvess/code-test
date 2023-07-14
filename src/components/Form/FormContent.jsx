import P from 'prop-types';
import { twMerge } from 'tailwind-merge';

const FormContent = ({ children, ...rest }) => {
  return (
    <div className={twMerge(`flex flex-col gap-[12px]`, rest.className)}>
      {children}
    </div>
  );
};

FormContent.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])

}

export default FormContent;
