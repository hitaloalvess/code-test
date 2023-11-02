import { useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { backgroundGrade } from './styles.module.css';

const STEP_ZOOM = 0.05;
const BackgroundGrade = () => {

  const { scale, dimensionsDeviceArea } = useStore(store => ({
    scale: store.scale,
    dimensionsDeviceArea: store.dimensionsDeviceArea
  }), shallow);

  const bgGradeRef = useRef(null);
  const [oldDeviceScale, setOldDeviceScale] = useState(scale);
  const [bgScale, setBgScale] = useState(1.25);

  function drawBackground() {
    const SPACING = 15 * bgScale;
    const CIRCLE_RADIUS = 2 * bgScale;
    const CIRCLE_COLOR = '#d0d0d0';

    const bg = bgGradeRef.current;
    const ctx = bg.getContext('2d');

    bg.width = dimensionsDeviceArea.width;
    bg.height = dimensionsDeviceArea.height;

    ctx.clearRect(0, 0, (bg.width), (bg.height));
    ctx.fillStyle = CIRCLE_COLOR;

    for (let rowHeight = 0; rowHeight <= bg.height; rowHeight += SPACING) {

      for (let posX = 0; posX <= bg.width; posX += SPACING) {
        ctx.beginPath();
        ctx.moveTo(posX, 0);
        ctx.arc(posX, rowHeight, CIRCLE_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
      }

    }
  }


  useEffect(() => {
    drawBackground();

    window.addEventListener('resize', drawBackground);

    return () => {
      window.removeEventListener('resize', drawBackground);
    }
  }, [bgScale, dimensionsDeviceArea.width, dimensionsDeviceArea.height]);

  useEffect(() => {
    setBgScale(prevScale => {

      if (oldDeviceScale < scale) {
        return prevScale + STEP_ZOOM;
      }

      if (oldDeviceScale > scale) {
        return prevScale - STEP_ZOOM;
      }

      return prevScale;
    })

    setOldDeviceScale(scale);

  }, [scale]);

  return (
    <canvas
      className={backgroundGrade}
      ref={bgGradeRef}
    ></canvas>
  );
};


export default BackgroundGrade;
