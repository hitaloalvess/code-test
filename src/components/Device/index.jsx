import { memo } from 'react';
import { useDrag } from 'react-dnd';
import P from 'prop-types';

import Ldr from './Ldr';
import Led from './Led';

import {
  deviceContainer,
  deviceContent
} from './styles.module.css';

const Device = memo(function Device({ device: { posX, posY, ...device } }) {

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'device',
    item: { ...device }
  }), []);

  const devices = {
    'ldr': <Ldr
      deviceRef={drag}
      {...device}
    />,
    'led': <Led
      deviceRef={drag}
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
      style={{ left: `${posX}px`, top: `${posY}px` }}
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
