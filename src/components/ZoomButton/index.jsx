import imgZoomButton from '@/assets/images/buttons/zoom-button.svg';

import { useDevices } from '@/hooks/useDevices';
import CircleButton from '../CircleButton';

import { zoomContent, zoomIncrease, zoomDecrease } from './styles.module.css';
import { useState } from 'react';
const ZoomButton = () => {
  const {
    handleDecreaseDeviceScale,
    handleIncreaseDeviceScale,
  } = useDevices();

  const [activeActions, setActiveActions] = useState(false);

  const handleClick = () => {
    setActiveActions(prevActive => !prevActive);
  }


  return (
    <div className={zoomContent}>
      {activeActions && (
        <>
          <button
            className={zoomIncrease}
            onClick={handleIncreaseDeviceScale}
          >
            +
          </button>
          <button
            className={zoomDecrease}
            onClick={handleDecreaseDeviceScale}
          >
            -
          </button>
        </>
      )}

      <CircleButton
        imgSrc={imgZoomButton}
        name={'zoom'}
        handleClick={handleClick}
      />
    </div>
  );
};

export default ZoomButton;
