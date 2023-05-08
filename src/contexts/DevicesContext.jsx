import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 } from 'uuid';

import { positionDevice } from '@/utils/devices-functions'


export const DevicesContext = createContext();


export const DevicesProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);

  const addDevice = useCallback((item, monitor) => {
    const { width, height } = item.draggedDevice.getBoundingClientRect();
    const { x, y } = monitor.getClientOffset();
    const [posX, posY] = positionDevice({ x, y, width, height });

    const elementIndex = devices.find(device => device.id === item.id);

    if (!elementIndex) {
      setDevices((devices) => [...devices, {
        ...item,
        id: v4(),
        posX,
        posY
      }]);

      return;

    }

    const newListDevices = devices.map(device => {
      if (device.id === item.id) {
        return {
          ...device,
          posX,
          posY
        }
      }
      return device
    })
    setDevices(newListDevices);


  }, [devices]);

  const deleteDevice = useCallback((id) => {
    const newDevices = devices.filter(device => {
      return device.id !== id
    });

    setDevices(newDevices);
  }, [devices]);

  return (
    <DevicesContext.Provider
      value={{ devices, addDevice, deleteDevice }}
    >
      {children}
    </DevicesContext.Provider>
  )
}

DevicesProvider.propTypes = {
  children: P.element.isRequired
}
