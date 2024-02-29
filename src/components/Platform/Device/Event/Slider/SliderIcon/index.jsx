import P from 'prop-types';

import * as SI from './styles.module.css';

const SliderIcon = ({ currentValue, limit }) => {
  return (
    <>
      <p
        className={SI.numberValue}
      >
        {currentValue}
      </p>

      <input
        type="range"
        min='0'
        className={SI.rangeSlider}
        max={limit}
        value={currentValue}
        readOnly={true}
      />
    </>
  );
};

SliderIcon.propTypes = {
  currentValue: P.number.isRequired,
  limit: P.number.isRequired
}

export default SliderIcon;
