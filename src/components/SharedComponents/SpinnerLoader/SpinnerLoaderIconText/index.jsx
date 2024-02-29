import P from 'prop-types';

import * as SL from './styles.module.css';

const SpinnerLoaderIconText = ({ text }) => {
  return (
    <div className={SL.container}>
      <span className={SL.loader}></span>
      <p className={SL.loaderLegend}>{text}</p>
    </div>
  );
};

SpinnerLoaderIconText.propTypes = {
  text: P.string.isRequired
}

export default SpinnerLoaderIconText;
