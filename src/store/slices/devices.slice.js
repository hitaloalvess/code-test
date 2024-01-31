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
  devicesGroups: {
    teste1: {
      devices: ['a'],
      value: 10
    },
    teste2: {
      devices: ['b'],
      value: 0
    },
    teste3: {
      devices: ['c'],
      value: 0
    },
  },

  getGroups: () => {
    const { devicesGroups } = get ();
    return Object.keys(devicesGroups);
  },

  getGroupByName: (groupName) => {
    const { devicesGroups } = get ();
    return devicesGroups[groupName]
  },

  changeDeviceGroup: (groupName, device) => {
    const { devicesGroups } = get ();
    const newDevicesGroups = { ...devicesGroups };

    const groups = Object.keys(devicesGroups);

    groups.forEach(element => {
       const result = devicesGroups[element].devices.find((devicesId) => devicesId === device.id);

       if (result !== undefined){
         devicesGroups[element].devices.splice(devicesGroups[element].devices.indexOf(device.id), 1);
       }

       if(devicesGroups[element].devices.length === 0)
         delete newDevicesGroups[element];
    });

    newDevicesGroups[groupName].devices.push(device.id);
    device.value.groupName = groupName;

    console.log(newDevicesGroups);
    set({ devicesGroups: newDevicesGroups })
  },

  addGroup: (groupName, device) => {
    const devices = [device.id]
    set((state) => ({
      devicesGroups: {
        ...state.devicesGroups,
        [`${groupName}`]: {
          devices,
          value: 0
        }
      }
    }));

    const {changeDeviceGroup} = get();
    changeDeviceGroup(groupName, device);
  },

  insertDevice: ({ device, dropPos }) => {
    const { platformRef } = get();

    Object.keys(device.connectors).forEach(connector => {
      device.connectors[connector].id = null;
    });

    const { width, height } = device.draggedDevice.getBoundingClientRect();
    const { x, y } = dropPos;

    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: platformRef,
    });

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

    console.log(device);
  },

  deleteDevice: (deviceId) => {
    const { devices } = get();
    const newDevices = { ...devices };

    delete newDevices[deviceId];

    set({ devices: newDevices })

    const { devicesGroups } = get ();
    const newDevicesGroups = { ...devicesGroups};
    const groups = Object.keys(devicesGroups);

    groups.forEach(element => {
       const result = devicesGroups[element].devices.find((device) => device === deviceId);

       if (result !== undefined){
         devicesGroups[element].devices.splice(devicesGroups[element].devices.indexOf(deviceId), 1);
       }

      if(devicesGroups[element].devices.length === 0)
        delete newDevicesGroups[element];
    });

    set({ devicesGroups: newDevicesGroups })
  },

  updateDeviceValue: (deviceId, newValues) => {
    if (!deviceId) return;

    console.log('Dispositivo alterado: ', {deviceId, newValues});

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
