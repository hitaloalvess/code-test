import { memo } from 'react';
import Ldr from './Ldr';
import Led from './Led';
import P from 'prop-types';

import {
  deviceContainer,
  deviceContent
} from './styles.module.css';

const Device = memo(function Device({ device: { posX, posY, ...device } }) {
  const devices = {
    'ldr': <Ldr
      {...device}
    />,
    'led': <Led
      {...device}
    />
  }

  const currentDevice = devices[device.name];

  if (!currentDevice) {
    return;
  }

  return (
    <div
      className={deviceContainer}
      style={{ left: `${posX}px`, top: `${posY}px` }}
    >
      <div
        className={deviceContent}
      >
        {currentDevice}
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
