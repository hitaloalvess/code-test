
import P from 'prop-types';

import * as F from './styles.module.css';

const FormRoot = ({ onSubmit, children, ...rest }) => {
  return (
    <form
      {...rest}
      onSubmit={onSubmit}
      className={F.container}
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
