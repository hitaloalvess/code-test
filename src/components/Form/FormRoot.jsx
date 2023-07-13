
import P from 'prop-types';

const FormRoot = ({ onSubmit, children }) => {
  return (
    <form
      onSubmit={onSubmit}
      className='w-[420px] flex flex-col gap-[32px]'
    >
      {children}
    </form>
  )
};

FormRoot.propTypes = {
  onSubmit: P.func.isRequired,
  children: P.element.isRequired
}

export default FormRoot;
