import P from 'prop-types';

import * as QC from './styles.module.css';

const QuestionContent = ({ children }) => {
  return (
    <div className={QC.content}>
      {children}
    </div>
  );
};

QuestionContent.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default QuestionContent;
