import P from 'prop-types';

import * as QR from './styles.module.css';

const QuestionRoot = ({ children }) => {
  return (
    <details className={QR.container}>
      {children}
    </details>
  );
};

QuestionRoot.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default QuestionRoot;
