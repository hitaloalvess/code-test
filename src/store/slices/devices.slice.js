import { v4 } from 'uuid';

import { calcPositionDevice } from '@/utils/devices-functions';
import {
  calcDimensionsDeviceArea,
  calcDistanceInvalidArea
} from '@/utils/devices-functions';

export const createDevicesSlice = (set, get) => ({
  devices: {},
  dimensionsDeviceArea: {
    minW: window.innerWidth * 1.5,
    minH: window.innerHeight * 1.5,
    width: window.innerWidth * 1.5,
    height: window.innerHeight * 1.5
  },

  insertDevice: ({ device, dropPos }) => {
    const { platformRef } = get();

    const { width, height } = device.draggedDevice.getBoundingClientRect();
    const { x, y } = dropPos;
    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: platformRef,
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
    if (!deviceId) return;

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
    const { sidebarRef } = get();

    if (!Object.hasOwn(device, 'id')) return;

    const updatedDevice = calcDistanceInvalidArea({
      sidebarRef,
      device
    });

    set((state) => ({
      devices: {
        ...state.devices,
        [device.id]: {
          ...updatedDevice
        }
      }
    }))
  },

  repositionDevice: ({ device, screenPos }) => {
    const {
      platformRef,
      updateDimensionsDeviceArea,
      devices,
    } = get();
    const { id, deviceRef } = device;

    const { width, height } = deviceRef.current.getBoundingClientRect();

    const { x, y } = screenPos;
    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: platformRef,
    });


    const dimensionsDeviceArea = calcDimensionsDeviceArea({
      ...devices,
      [id]: {
        ...devices[id],
        posX,
        posY,
        deviceRef
      }
    });

    updateDimensionsDeviceArea(dimensionsDeviceArea);

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
  },

  updateDimensionsDeviceArea: (dimensions) => {
    const { dimensionsDeviceArea: { minW, minH } } = get();

    set((state) => ({
      dimensionsDeviceArea: {
        ...state.dimensionsDeviceArea,
        width: dimensions.width < minW ? minW : dimensions.width,
        height: dimensions.height < minH ? minH : dimensions.height
      }
    }))
  }
})
