/* eslint-disable no-empty-pattern */

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { useDrag } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import DeviceFactory from './SharedDevice/DeviceFactory';

import * as D from './styles.module.css';


const Device = memo(function Device({ device }) {
  const {
    scale,
    updateDeviceValue
  } = useStore(store => ({
    scale: store.scale,
    updateDeviceValue: store.updateDeviceValue
  }), shallow);

  const deviceRef = useRef(null);

  const [data, setData] = useState(device);

  const [{ }, drag] = useDrag(() => {
    return {
      type: 'device',
      item: {
        ...device,
        deviceRef
      },
    }
  }, []);


  const handleSaveData = useCallback((keyValue, newValue) => {
    setData(prev => {
      return {
        ...prev,
        [keyValue]: {
          ...prev[`${keyValue}`],
          ...newValue
        }
      }
    });
  }, [data]);


  useEffect(() => {
    updateDeviceValue(data.id, {
      connectors: {
        ...data.connectors
      }
    })
  }, [data.connectors]);

  useEffect(() => {
    setData(prev => {
      return {
        ...prev,
        posX: device.posX,
        posY: device.posY
      }
    })
  }, [device.posX, device.posY]);

  return (
    <div
      className={D.deviceContainer}
      style={{ left: `${data.posX}px`, top: `${data.posY}px`, transform: `scale(${scale})` }}
      ref={deviceRef}
      onContextMenu={e => e.preventDefault()}
    >
      <div
        className={D.deviceContent}
      >
        {
          <DeviceFactory
            data={data}
            dragRef={drag}
            onSaveData={handleSaveData}
          />
        }
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
