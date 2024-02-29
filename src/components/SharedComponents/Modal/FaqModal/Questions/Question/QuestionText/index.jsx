import P from 'prop-types';

import * as QT from './styles.module.css';

const QuestionText = ({ text }) => {
  return (
    <p className={QT.text}>
      {text}
    </p>
  );
};

QuestionText.propTypes = {
  text: P.string.isRequired
}

export default QuestionText;
