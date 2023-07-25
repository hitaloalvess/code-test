import P from 'prop-types';

const QuestionVideo = ({ url, ...rest }) => {
  return (
    <iframe
      src={url}
      {...rest}
    ></iframe>
  );
};

QuestionVideo.propTypes = {
  url: P.string.isRequired
}

export default QuestionVideo;
