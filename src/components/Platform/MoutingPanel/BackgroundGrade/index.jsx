import { useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { backgroundGrade } from './styles.module.css';

const STEP_ZOOM = 0.05;
const BackgroundGrade = ({ moutingPanelRef }) => {

  const { scale } = useStore(store => ({
    scale: store.scale
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

    const { width: containerWidth, height: containerHeight } = moutingPanelRef.current.getBoundingClientRect();
    bg.width = containerWidth;
    bg.height = containerHeight;

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
  }, [bgScale]);

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

BackgroundGrade.propTypes = {
  moutingPanelRef: P.object.isRequired
}

export default BackgroundGrade;
