import P from 'prop-types';

import * as I from './styles.module.css';

const InputRoot = ({ error, children }) => {
  return (
    <div className={I.container}>
      <div className={I.content}>
        {children}
      </div>

      {error && (
        <span
          className={I.messageError}
        >
          {error.message}
        </span>
      )}

    </div>
  );
};

InputRoot.propTypes = {
  error: P.object,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])

}

export default InputRoot;
