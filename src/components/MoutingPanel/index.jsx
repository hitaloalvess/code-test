import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import Device from '@/components/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';
import ManualButton from '@/components/ManualButton';
import ZoomButton from '@/components/ZoomButton';
import FaqButton from '@/components/FaqButton';

import { moutingPanelContainer, buttonsContainer } from './styles.module.css';

const MoutingPanel = () => {
  const { devices, addDevice, repositionDevice } = useDevices();
  const { flows, connectionLines, updateLines, updateFlow } = useFlow();
  const moutingPanelRef = useRef(null);

  const attachRef = (el) => {
    drop(el);
    moutingPanelRef.current = el;
  }

  const deviceDrop = (item, monitor) => {
    const elementIndex = devices.find(device => device.id === item.id);

    if (!elementIndex) {
      addDevice(item, monitor)

      return;
    }

    repositionDevice({
      device: { ...item },
      screen: monitor,
      flows,
      connectionLines,
      updateLines,
      updateFlow
    });
  }

  // eslint-disable-next-line no-unused-vars
  const [_, drop] = useDrop(() => ({
    accept: ['device', 'menu-device'],
    drop: (item, monitor) => {
      deviceDrop(item, monitor)
    },
  }), [devices, flows, connectionLines]);

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

      <BackgroundGrade
        moutingPanelRef={moutingPanelRef}
      />


      <div className={buttonsContainer}>
        <ManualButton />
        <FaqButton />
        <ZoomButton />
      </div>

    </div>
  );
};

export default MoutingPanel;
