import P from 'prop-types';

import * as C from './styles.module.css';

const ConnectorsContent = ({ children }) => {

  return (
    <div className={`${C.content}`}>
      {children}
    </div>
  );
};

ConnectorsContent.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}
export default ConnectorsContent;
