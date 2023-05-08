import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices';
import Device from '@/components/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';

import { moutingPanelContainer } from './styles.module.css';

const MoutingPanel = () => {
  const { devices, addDevice } = useDevices();
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
            device={device}
          />
        ))
      }
      <LinesContainer />

      <BackgroundGrade moutingPanelRef={moutingPanelRef} />
    </div>
  );
};

export default MoutingPanel;
