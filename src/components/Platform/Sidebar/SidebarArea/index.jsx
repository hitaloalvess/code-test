import { useEffect, useRef, useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import P from 'prop-types';

import { socket } from '@/services/websocket';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { mockDevices, deviceTypes } from '@/data/devices.js';
import { transformDeviceName } from '@/utils/devices-functions';
import MenuDevice from '../MenuDevice';
import ButtonConnect from '../ButtonConnect';

import * as SA from './styles.module.css';
const SidebarArea = ({ area, activeTrashArea }) => {

  const isFirstRender = useRef(true);
  const { user } = useAuth();
  const { enableModal, disableModal } = useModal();
  const [devices, setDevices] = useState(mockDevices);

  const handleOpenModal = () => {
    enableModal({
      typeContent: 'connect-device',
      title: 'Conectar dispositivo',
      subtitle: 'Insira as informações do dispositivo que deseja conectar',
      handleConfirm: (data) => {
        socket.emit('sensor/register', {
          cpf: user.cpf,
          ...data
        });
      }
    })
  }

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
            {...device}
          ]
        }
      })

      disableModal('connect-device');
      toast.success('Dispositivo conectado com sucesso!!');

    });

  }, []);

  return (
    <div className={SA.container}>

      <div className={SA.devicesList}>
        <ul
        >
          {
            Object.values(devices[area]).map((device) => (
              <MenuDevice
                key={device.id}
                device={device}
              />
            ))
          }

          {
            area === 'hardware' &&
            <ButtonConnect onOpenModal={handleOpenModal} />
          }
        </ul>
      </div>
      {activeTrashArea && (
        <div
          className={SA.trashArea}
        >
          <Trash />
        </div>
      )}
    </div>
  );
};

SidebarArea.propTypes = {
  area: P.string.isRequired,
  activeTrashArea: P.bool.isRequired
}

export default SidebarArea;
