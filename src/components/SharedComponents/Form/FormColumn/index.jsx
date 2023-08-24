import P from 'prop-types';

import * as F from './styles.module.css';

const FormColumn = ({ children }) => {
  return (
    <div className={F.column}>
      {children}
    </div>
  );
};

FormColumn.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default FormColumn;
