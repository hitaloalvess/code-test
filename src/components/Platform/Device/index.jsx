/* eslint-disable no-empty-pattern */

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { useDrag } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices.js';
import DeviceFactory from './SharedDevice/DeviceFactory';

import * as D from './styles.module.css';


const Device = memo(function Device({ device: { ...device } }) {
  const { deviceScale, updateDeviceValue } = useDevices();

  const deviceRef = useRef(null);

  const [data, setData] = useState(device);
  const [activeActBtns, setActiveActBtns] = useState(false);

  const [{ }, drag] = useDrag(() => {
    return {
      type: 'device',
      item: {
        ...device,
        deviceRef
      },
    }
  }, []);

  const handleActBtns = useCallback((value) => {
    setActiveActBtns(value)
  }, []);

  const handleSaveData = useCallback((keyValue, newValue) => {
    setData(prev => {
      return {
        ...prev,
        [`${keyValue}`]: {
          ...prev[`${keyValue}`],
          ...newValue
        }
      }
    });
  }, []);


  useEffect(() => {
    updateDeviceValue(data.id, {
      connectors: {
        ...data.connectors
      }
    })
  }, [data.connectors]);

  return (
    <>
      <div
        className={D.deviceContainer}
        style={{ left: `${device.posX}px`, top: `${device.posY}px`, transform: `scale(${deviceScale})` }}
        ref={deviceRef}
      >
        <div
          className={D.deviceContent}
        >
          {
            <DeviceFactory
              data={data}
              dragRef={drag}
              activeActBtns={activeActBtns}
              onChangeActBtns={handleActBtns}
              onSaveData={handleSaveData}
            />
          }
        </div>
      </div>
    </>
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
