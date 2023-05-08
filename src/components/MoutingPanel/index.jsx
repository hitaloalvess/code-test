import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import P from 'prop-types';

import Device from '@/components/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';

import { moutingPanelContainer } from './styles.module.css';

const MoutingPanel = ({ devices = [], deleteDevice, addDevice }) => {
  const moutingPanelRef = useRef(null);

  const attachRef = (el) => {
    drop(el);
    moutingPanelRef.current = el;
  }

  // eslint-disable-next-line no-unused-vars
  const [_, drop] = useDrop(() => ({
    accept: ['device', 'menu-device'],
    drop: (item, monitor) => addDevice(item, monitor)
  }), [devices]);

  return (
    <div
      className={moutingPanelContainer}
      ref={attachRef}
    >
      {
        devices.map(device => (
          <Device
            key={device.id}
            device={{
              ...device,
              handleDelete: deleteDevice
            }}
          />
        ))
      }
      <LinesContainer />

      <BackgroundGrade moutingPanelRef={moutingPanelRef} />
    </div>
  );
};

MoutingPanel.propTypes = {
  devices: P.arrayOf(P.shape({
    id: P.string.isRequired,
    name: P.string.isRequired,
    imgSrc: P.string.isRequired,
    type: P.string.isRequired,
    category: P.string.isRequired
  })),
  deleteDevice: P.func.isRequired,
  addDevice: P.func.isRequired
}

export default MoutingPanel;
