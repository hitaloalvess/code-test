import { useState } from 'react';
import { useDrop } from 'react-dnd';

import { useModal } from '@/hooks/useModal';
import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';

import { menu } from './styles.module.css';

const Sidebar = () => {
  const { enableModal, disableModal } = useModal();
  const { deleteDeviceConnections, flows } = useFlow();
  const { devices, deleteDevice } = useDevices();

  const [currentArea, setCurrentArea] = useState('entry');

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'device',
    drop: (item) => {
      enableModal({
        typeContent: 'confirmation',
        title: 'Cuidado',
        subtitle: 'Tem certeza que deseja excluir o componente?',
        handleConfirm: () => {
          deleteDeviceConnections(item.id);
          deleteDevice(item.id);
          disableModal('confirmation');
        }
      })
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [devices, flows]);

  const handleSelectArea = (currentArea) => {
    setCurrentArea(currentArea);
  }

  return (
    <nav
      className={menu}
      ref={drop}
    >
      <MenuButtons
        handleSelectArea={handleSelectArea}
        area={currentArea}
      />
      <SidebarArea
        area={currentArea}
        activeTrashArea={isOver}
      />

    </nav>
  );
};


export default Sidebar;
