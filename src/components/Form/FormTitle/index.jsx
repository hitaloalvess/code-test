import P from 'prop-types';

import * as F from './styles.module.css';

const FormTitle = ({ text }) => {
  return (
    <h1 className={F.title}>
      {text}
    </h1>
  );
};

FormTitle.propTypes = {
  text: P.string.isRequired
}

export default FormTitle;
