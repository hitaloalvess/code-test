import { useState } from 'react';

import CircleButton from '@/components/Platform/MoutingPanel/CircleButton';
import imgZoomButton from '@/assets/images/buttons/zoom-button.svg';

import { zoomContent } from './styles.module.css';
import InputRangeZoom from './InputRangeZoom';


const ZoomButton = () => {

  const [activeActions, setActiveActions] = useState(false);

  const handleClick = () => {
    setActiveActions(prevActive => !prevActive);
  }

  return (
    <div className={zoomContent}>
      {activeActions && <InputRangeZoom />}

      <CircleButton
        imgSrc={imgZoomButton}
        name={'zoom'}
        handleClick={handleClick}
        title='Botão de zoom'
      />
    </div>
  );
};

export default ZoomButton;
