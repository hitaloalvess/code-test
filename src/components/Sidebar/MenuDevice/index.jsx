import { useDrag } from 'react-dnd';
import { deviceItemContent, deviceItemContainer } from './styles.module.css';
import { useState } from 'react';
import P from 'prop-types';

const MenuDevice = ({ device }) => {

  const [refDevice, setRefDevice] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [_, drag] = useDrag(() => ({
    type: 'menu-device',
    item: {
      ...device,
      draggedDevice: refDevice
    },
  }), [refDevice]);

  return (
    <li className={deviceItemContainer}>
      <div
        className={deviceItemContent}
        ref={(content) => {
          drag(content);
          setRefDevice(content);
        }}
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
