import { useState } from "react";
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';

import { inputZoom } from './styles.module.css';

const MAX_DEVICE_ZOOM = 1.5;
const MIN_DEVICE_ZOOM = 0.5;
const STEP_ZOOM = 0.1;

const InputRangeZoom = () => {
  const { handleZoomChange } = useStore(store => ({
    handleZoomChange: store.handleZoomChange
  }), shallow);

  const [zoomValue, setZoomValue] = useState(1);

  return (
    <input
      type="range"
      className={inputZoom}
      min={MIN_DEVICE_ZOOM}
      max={MAX_DEVICE_ZOOM}
      step={STEP_ZOOM}
      value={zoomValue}
      onInput={(event) => {
        const value = event.target.value;

        setZoomValue(value);
        handleZoomChange(value);
      }}
    />
  );
};

export default InputRangeZoom;
