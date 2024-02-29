import P from 'prop-types';

import * as SL from './styles.module.css';

const SpinnerLoaderRoot = ({ children }) => {
  return (
    <div className={SL.loaderContainer}>
      {children}
    </div>
  );
};

SpinnerLoaderRoot.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default SpinnerLoaderRoot;
