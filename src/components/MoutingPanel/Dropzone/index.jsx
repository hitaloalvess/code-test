import { useDevices } from '@/hooks/useDevices';

import Device from '@/components/Device/index';

import { dropzone } from './styles.module.css';
import { forwardRef } from 'react';

const Dropzone = forwardRef(function Dropzone(_, ref) {

  const { devices } = useDevices();

  return (
    <div
      className={dropzone}
      ref={ref}
    >
      {
        devices.map(device => (
          <Device
            key={device.id}
            device={device}
          />
        ))
      }
    </div>
  );
});

export default Dropzone;
