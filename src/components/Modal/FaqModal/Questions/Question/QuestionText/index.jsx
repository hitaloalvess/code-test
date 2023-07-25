import P from 'prop-types';

const QuestionText = ({ text }) => {
  return (
    <p>
      {text}
    </p>
  );
};

QuestionText.propTypes = {
  text: P.string.isRequired
}

export default QuestionText;
