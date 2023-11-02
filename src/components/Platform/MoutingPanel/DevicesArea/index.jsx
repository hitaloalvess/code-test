import { shallow } from 'zustand/shallow';

import { calcDimensionsDeviceArea } from '@/utils/devices-functions';
import { useStore } from '@/store';
import Device from '@/components/Platform/Device';

import * as DA from './styles.module.css';
import { useEffect, useMemo, useRef } from 'react';

const MARGIN_W = 120;
const MARGIN_H = 80;

const DevicesArea = () => {

  const {
    devices,
    dimensionsDeviceArea,
    updateDimensionsDeviceArea,
  } = useStore(store => ({
    devices: store.devices,
    dimensionsDeviceArea: store.dimensionsDeviceArea,
    updateDimensionsDeviceArea: store.updateDimensionsDeviceArea,
  }), shallow);

  const isFirstRender = useRef(true);
  const ref = useRef(null);

  const deviceListLength = useMemo(() => {
    const legth = Object.values(devices).length;

    if (legth <= 0) return;

    return legth;
  }, [devices]);

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    const dimensionsDeviceArea = calcDimensionsDeviceArea(devices);

    updateDimensionsDeviceArea(dimensionsDeviceArea);
  }, [deviceListLength]);


  return (
    <div
      ref={ref}
      className={DA.devicesAreaContainer}
      style={{
        width: `${dimensionsDeviceArea.width + MARGIN_W}px`,
        height: `${dimensionsDeviceArea.height + MARGIN_H}px`
      }}
    >
      {
        Object.values(devices).map(device => {
          return (
            <Device
              key={device.id}
              device={device}
            />
          )
        })
      }
    </div >
  );
};

export default DevicesArea;
