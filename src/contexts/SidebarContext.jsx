import P from 'prop-types';
import { createContext, useState, useRef } from "react";
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { mockDevices } from '@/data/devices.js';
import { useStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { apiMicrocode } from '@/services/api-microcode';
import { MicrocodeHttpRoutes } from '@/constants/hardware-communication';
import { transformDeviceName } from '@/utils/devices-functions'


export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const { enableModal, disableModal } = useModal();
  const {
    deleteDeviceConnections,
    loadRef,
  } = useStore(store => ({
    deleteDeviceConnections: store.deleteDeviceConnections,
    loadRef: store.loadRef,
  }), shallow);

  const sidebarRef = useRef(null);
  const [currentArea, setCurrentArea] = useState('entry');
  const [devices, setDevices] = useState(mockDevices);

  const attachRef = (el) => {
    drop(el);
    sidebarRef.current = el;
    loadRef('sidebarRef', sidebarRef);
  }

  const handleSelectArea = (currentArea) => {
    setCurrentArea(currentArea);
  }

  const handleCreatePhysicalDevice = async ({ mac, type }) => {

    const { name, category } = await apiMicrocode.get(`${MicrocodeHttpRoutes.HARDWARE_INFO}/${type}`);
    const deviceName = transformDeviceName(name, 'rm-space-firstLower');
    const device = devices[category].find(device => device.name === deviceName);

    const newPhysicalDevice = {
      ...device,
      mac,
      id: mac,
      name: `physical${transformDeviceName(name, 'firstLetterUpper')}`,
      label: name,
      type: 'physical',
      typeId: type
    }

    setDevices(prevDevices => {
      return {
        ...prevDevices,
        hardware: [
          ...prevDevices.hardware,
          {
            ...newPhysicalDevice,
            inUse: false
          }
        ]
      }
    })
  }

  const handleStatusHardwareDevice = ({ id, inUse }) => {
    setDevices(prevDevices => {

      const newHardwareDevices = prevDevices?.hardware.map(device => {

        if (device.id === id) {
          return {
            ...device,
            inUse
          }
        }

        return device;
      });

      return {
        ...prevDevices,
        hardware: newHardwareDevices
      }

    });
  }


  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'device',
    drop: (item) => {
      enableModal({
        typeContent: 'confirmation',
        title: 'Cuidado',
        subtitle: 'Tem certeza que deseja excluir o componente?',
        handleConfirm: () => {
          deleteDeviceConnections({ deviceId: item.id });
          disableModal('confirmation');

          if (item.type === 'physical') {
            handleStatusHardwareDevice({
              id: item.mac,
              inUse: false
            })

          }
        }
      })
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), []);

  return (
    <SidebarContext.Provider value={{
      currentArea,
      devices,
      activeTrashArea: isOver,
      drop,
      attachRef,
      handleSelectArea,
      handleStatusHardwareDevice,
      handleCreatePhysicalDevice
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

SidebarProvider.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

