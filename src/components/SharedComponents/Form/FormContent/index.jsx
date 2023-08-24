import P from 'prop-types';

import * as F from './styles.module.css';

const FormContent = ({ children, ...rest }) => {
  return (
    <div {...rest} className={F.content}>
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
