import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import Device from '@/components/Platform/Device';

import * as DA from './styles.module.css';

const DevicesArea = () => {

  const {
    devices,
  } = useStore(store => ({
    devices: store.devices,
  }), shallow);

  return (
    <div className={DA.devicesAreaContainer}>
      {
        Object.values(devices).map(device => (
          <Device
            key={device.id}
            device={device}
          />
        ))
      }
    </div>
  );
};

export default DevicesArea;
