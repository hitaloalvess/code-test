/* eslint-disable no-unused-vars */

import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import P from 'prop-types';
import { isMobile } from 'react-device-detect';

import { deviceItemContent, deviceItemContainer } from './styles.module.css';

const PRESSED_BREAK = 0.15; //150 ms
const MenuDevice = ({ device }) => {

  const [refDevice, setRefDevice] = useState(null);
  const [canDrag, setCanDrag] = useState(() => isMobile ? false : true);

  const intervalPressed = useRef(null);

  const [_, drag] = useDrag(() => ({
    type: 'menu-device',
    item: {
      ...device,
      draggedDevice: refDevice
    },
    canDrag: () => canDrag,
    end: () => setCanDrag(isMobile ? false : true)
  }), [refDevice, canDrag]);


  const handleTouchStart = () => {
    intervalPressed.current = setTimeout(() => {
      setCanDrag(true);
    }, PRESSED_BREAK * 1000);
  }

  const handleTouchMove = () => {
    clearTimeout(intervalPressed.current);
    intervalPressed.current = null;
  }

  const handleTouchEnd = () => {
    clearTimeout(intervalPressed.current);
    intervalPressed.current = null;
  }

  return (
    <li className={deviceItemContainer}>
      <div
        className={deviceItemContent}
        ref={(content) => {
          drag(content);
          setRefDevice(content);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={device.imgSrc}
          alt={device.name}
          loading='lazy'
        />
      </div>
      <p>{device.name}</p>
    </li>
  );
};

MenuDevice.propTypes = {
  device: P.shape({
    id: P.number.isRequired,
    name: P.string.isRequired,
    imgSrc: P.string.isRequired,
    type: P.string.isRequired,
    category: P.string.isRequired
  })
}

export default MenuDevice;
