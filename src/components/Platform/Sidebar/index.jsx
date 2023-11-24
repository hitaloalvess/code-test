import { useEffect, useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { mockDevices, deviceTypes } from '@/data/devices.js';
import { transformDeviceName } from '@/utils/devices-functions';
import { useStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { socket } from '@/services/websocket';
import { useAuth } from '@/hooks/useAuth';
import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';
import MenuDeviceVirtual from './MenuDeviceVirtual';
import MenuDevicePhysical from './MenuDevicePhysical';
import ButtonConnect from './ButtonConnect';

import { menu } from './styles.module.css';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { enableModal, disableModal } = useModal();
  const { user } = useAuth();

  const {
    deleteDeviceConnections,
    loadRef,
  } = useStore(store => ({
    deleteDeviceConnections: store.deleteDeviceConnections,
    loadRef: store.loadRef,
  }), shallow);
  const sidebarRef = useRef(null);
  const isFirstRender = useRef(true);

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

  const handleStatusHardwareDevice = ({ id, inUse }) => {
    setDevices(prevDevices => {

      const newHardwareDevices = prevDevices?.hardware.map(device => {

        if(device.id === id){
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

          if(item.type === 'physical'){
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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    socket.on(`${user.cpf}/sensor/register`, (data) => {
      const { mac, name, type } = data;

      const deviceType = deviceTypes.find(deviceType => deviceType.id === type)
      const deviceTypeName = transformDeviceName(deviceType.name, 'rm-space-firstLower');
      const deviceInfo = mockDevices[deviceType.category].find(device => device.name === deviceTypeName );

      const device = {
        ...deviceInfo,
        mac,
        id: mac,
        name: `physical${transformDeviceName(deviceInfo.name, 'firstLetterUpper')}`,
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
              ...device,
              inUse: false
            }
          ]
        }
      })

      disableModal('connect-device');
      toast.success('Dispositivo conectado com sucesso!!');

    });

  }, []);

  return (
    <nav
      className={menu}
      ref={attachRef}
    >
      <MenuButtons
        handleSelectArea={handleSelectArea}
        area={currentArea}
      />

      <SidebarArea
        activeTrashArea={isOver}
      >
        <>
        {
            Object.values(devices[currentArea]).map((device) => (
              device.type === 'virtual' ?
              <MenuDeviceVirtual
                key={device.id}
                device={device}
              /> :
              <MenuDevicePhysical
                key={device.id}
                device={device}
                onUpdateStatus={handleStatusHardwareDevice}
              />
            ))
          }

          {
            currentArea === 'hardware' &&
            <ButtonConnect />
          }
        </>
      </SidebarArea>

    </nav>
  );
};


export default Sidebar;
