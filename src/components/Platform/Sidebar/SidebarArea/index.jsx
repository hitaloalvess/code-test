import { FaTrashAlt } from 'react-icons/fa';
import { mockDevices } from '@/data/devices.js';
import P from 'prop-types';

import MenuDevice from '../MenuDevice';

import { container, trashArea, devicesList } from './styles.module.css';

const SidebarArea = ({ area, activeTrashArea }) => {
  return (
    <div className={container}>

      <div className={devicesList}>
        <ul
        >
          {
            mockDevices[area]
              .map((device) => (
                <MenuDevice
                  key={device.id}
                  device={device}
                />
              ))
          }
        </ul>
      </div>
      {activeTrashArea && (
        <div
          className={trashArea}
        >
          <FaTrashAlt />
        </div>
      )}
    </div>
  );
};

SidebarArea.propTypes = {
  area: P.string.isRequired,
  activeTrashArea: P.bool.isRequired
}

export default SidebarArea;
