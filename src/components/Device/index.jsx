import { memo, useRef } from 'react';
import P from 'prop-types';
import { DragPreviewImage, useDrag } from 'react-dnd';

import imgInvisible from '@/assets/images/devices/preview-default.svg';

import Ldr from './Entry/Ldr';
import Potentiometer from './Entry/Potentiometer';
import Led from './Exit/Led';
import LedMono from './Exit/LedMono';

import {
  deviceContainer,
  deviceContent,
} from './styles.module.css';

const Device = memo(function Device({ device: { ...device } }) {
  const connRef = useRef(null);

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag, preview] = useDrag(() => ({
    type: 'device',
    item: {
      ...device,
      connRef,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [connRef]);

  const devices = {
    'ldr': <Ldr
      connRef={connRef}
      device={device}
      dragRef={drag}
    />,
    'potentiometer': <Potentiometer
      connRef={connRef}
      device={device}
      dragRef={drag}
    />,
    'led': <Led
    connRef={connRef}
    device={device}
    dragRef={drag}
    />,
    'ledMono': <LedMono
    connRef={connRef}
    device={device}
    dragRef={drag}
    />,
  }

  const CurrentDevice = devices[device.name];

  if (!CurrentDevice) {
    return;
  }

  return (
    <>
      <DragPreviewImage connect={preview} src={imgInvisible} style={{ opacity: 0 }} />

      <div
        className={deviceContainer}
        style={{ left: `${device.posX}px`, top: `${device.posY}px` }}
      >
        <div
          className={deviceContent}
        >
          {CurrentDevice}
        </div>
      </div>
    </>
  )
});

Device.propTypes = {
  device: P.shape({
    id: P.string,
    name: P.string.isRequired,
    imgSrc: P.string,
    type: P.string,
    category: P.string,
    posX: P.number.isRequired,
    posY: P.number.isRequired,
    draggedDevice: P.object
  }),
}

export default Device;
