import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';

import { menu } from './styles.module.css';

const Sidebar = () => {
  const { enableModal, disableModal } = useModal();
  const sidebarRef = useRef(null);

  const {
    deleteDeviceConnections,
    loadRef,
  } = useStore(store => ({
    deleteDeviceConnections: store.deleteDeviceConnections,
    loadRef: store.loadRef,
  }), shallow);

  const [currentArea, setCurrentArea] = useState('entry');

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
        }
      })
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), []);

  const handleSelectArea = (currentArea) => {
    setCurrentArea(currentArea);
  }

  const attachRef = (el) => {
    drop(el);
    sidebarRef.current = el;
    loadRef('sidebarRef', sidebarRef);
  }

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
        area={currentArea}
        activeTrashArea={isOver}
      />

    </nav>
  );
};


export default Sidebar;
