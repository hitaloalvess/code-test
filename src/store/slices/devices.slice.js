import { v4 } from 'uuid';

import { calcPositionDevice } from '@/utils/devices-functions';

export const createDevicesSlice = (set, get) => ({
  devices: {},

  insertDevice: ({ device, dropPos }) => {
    const { platformContainerRef } = get();

    const { width, height } = device.draggedDevice.getBoundingClientRect();
    const { x, y } = dropPos;
    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: platformContainerRef
    });


    delete device.draggedDevice;
    const id = v4();


    set((state) => ({
      devices: {
        ...state.devices,
        [`${id}`]: {
          ...device,
          id,
          posX,
          posY
        }
      }
    }));
  },

  deleteDevice: (deviceId) => {

    const { devices } = get();

    const newDevices = { ...devices };

    delete newDevices[deviceId];

    set({ devices: newDevices })
  },

  updateDeviceValue: (deviceId, newValues) => {

    set((state) => ({
      devices: {
        ...state.devices,
        [deviceId]: {
          ...state.devices[deviceId],
          ...newValues
        }
      }
    }))
  },

  loadDevice: (device) => {


    set((state) => ({
      devices: {
        ...state.devices,
        [device.id]: {
          ...device,
        }
      }
    }))
  },

  repositionDevice: ({ device, screenPos }) => {
    const { platformContainerRef } = get();
    const { id, deviceRef } = device;

    const { width, height } = deviceRef.current.getBoundingClientRect();

    const { x, y } = screenPos;
    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: platformContainerRef
    });

    set((state) => ({
      devices: {
        ...state.devices,
        [id]: {
          ...state.devices[id],
          posX,
          posY,
          deviceRef
        }
      }
    }))
  },

  getDevices: () => {
    const { devices } = get();

    return devices;
  }
})
