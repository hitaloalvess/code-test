import P from 'prop-types';

import * as Q from './styles.module.css';

const QuestionLink = ({ url, children, ...rest }) => {
  return (
    <a
      className={Q.questionLinkContainer}
      href={url}
      {...rest}
    >
      {children}
    </a>
  );
};

QuestionLink.propTypes = {
  url: P.string.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default QuestionLink;
