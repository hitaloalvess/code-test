import P from 'prop-types';
import { createContext, useState, useRef, useEffect } from "react";
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';
import { isMobile } from 'react-device-detect';

import { mockDevices } from '@/data/devices.js';
import { getHardwareInfoByType, getProjectById } from '@/api/http';
import { clearHardware } from '@/api/socket/hardware';
import { useStore } from '@/store';
import { useModal, useContextAuth } from '@/hooks';

import { transformDeviceName } from '@/utils/devices-functions'
import { useParams } from 'react-router-dom';


export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {

  const { id: projectId } = useParams();
  const { person } = useContextAuth();

  const {
    deleteDeviceConnections,
    loadRef,
  } = useStore(store => ({
    deleteDeviceConnections: store.deleteDeviceConnections,
    loadRef: store.loadRef,
  }), shallow);

  const sidebarRef = useRef(null);
  const isFirstRender = useRef(true);
  const { enableModal, disableModal } = useModal();
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

  const loadPhysicalDevices = async () => {

    const { project } = await getProjectById({ projectId });

    for (const device of Object.values(project.devices)) {
      if (device.type === 'physical') {
        const { id, name, type } = device;

        const newPhysicalDevice = {
          ...device,
          mac: id,
          id,
          name,
          label: name,
          type: 'physical',
          typeId: type,
          inUse: true,
          isDisabled: true,
          isFirstUse: false,
          canDrag: false
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
    }
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
                id: item.id,
                inUse: false,
                isDisabled: true,
                canDrag: false
              }
            })

          }
        }
      })
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), []);

  const handleBeforeUnload = () => {
    for (const hardware of devices.hardware) {
      clearHardware({ mac: hardware.id, userId: person.id });

    }

  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }
    loadPhysicalDevices()

  }, [])

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [devices.hardware])

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

