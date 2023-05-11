import { memo } from 'react';
import P from 'prop-types';

import Ldr from './Ldr';
import Led from './Led';

import {
  deviceContainer,
  deviceContent
} from './styles.module.css';

const Device = memo(function Device({ device: { ...device } }) {
  const devices = {
    'ldr': <Ldr
      {...device}
    />,
    'led': <Led
      {...device}
    />
  }

  const CurrentDevice = devices[device.name];

  if (!CurrentDevice) {
    return;
  }



  return (
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
