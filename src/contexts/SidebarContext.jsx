import P from 'prop-types';
import { createContext, useState, useRef } from "react";
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';
import { isMobile } from 'react-device-detect';

import { mockDevices } from '@/data/devices.js';
import { getHardwareInfoByType } from '@/api/http';
import { useStore } from '@/store';
import { useModal } from '@/hooks/useModal';

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

    const { hardware: { name, category } } = await getHardwareInfoByType({ hardwareType: type });
    const deviceName = transformDeviceName(name, 'rm-space-firstLower');
    const device = devices[category].find(device => device.name === deviceName);

    const newPhysicalDevice = {
      ...device,
      mac,
      id: mac,
      name: `physical${transformDeviceName(name, 'firstLetterUpper')}`,
      label: name,
      type: 'physical',
      typeId: type,
      inUse: false,
      isDisabled: false,
      isFirstUse: true,
      canDrag: isMobile ? false : true
    }

    setDevices(prevDevices => {
      return {
        ...prevDevices,
        hardware: [
          ...prevDevices.hardware,
          {
            ...newPhysicalDevice,
          }
        ]
      }
    })
  }

  const handleDeletePhysicalDevice = (physicalDeviceId) => {
    setDevices(prevDevices => {
      const newHardwareDevices = prevDevices?.hardware.filter(prevDevice => {
        return prevDevice.id !== physicalDeviceId
      })

      return {
        ...prevDevices,
        hardware: newHardwareDevices
      }
    })
  }

  const handleChangePhysicalDeviceInSidebar = ({ device }) => {
    setDevices(prevDevices => {

      const newHardwareDevices = prevDevices?.hardware.map(prevDevice => {

        if (prevDevice.id === device.id) {
          return {
            ...prevDevice,
            ...device
          }
        }

        return prevDevice;
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
            handleChangePhysicalDeviceInSidebar({
              device: {
                id: item.mac,
                inUse: false,
                isDisabled: true,
                canDrag: false
              }
            })

            //Todo: enviar mensagem ao backend para desvincular o usuário do dispositivo
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
      handleChangePhysicalDeviceInSidebar,
      handleCreatePhysicalDevice,
      handleDeletePhysicalDevice
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

