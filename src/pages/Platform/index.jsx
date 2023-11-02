import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import Header from '@/components/SharedComponents/Header';
import Sidebar from '@/components/Platform/Sidebar';
import CustomDragLayer from '@/components/Platform/CustomDragLayer';
import ActionsArea from '@/components/Platform/ActionsArea';

import * as P from './styles.module.css';

const Platform = () => {

  const { enableModal } = useModal();

  const {
    loadRef
  } = useStore(store => ({
    loadRef: store.loadRef
  }), shallow);

  const containerRef = useRef(null);

  const handleEnableInitialIntroModal = () => {
    const isFirstAccess = !localStorage.getItem('@Microdigo:platformAccessed');

    if (!isFirstAccess) {
      return;
    }

    enableModal({
      typeContent: 'initial-intro-platform',
      title: 'Deseja assistir um tutorial completo?',
    });

    localStorage.setItem('@Microdigo:platformAccessed', JSON.stringify(true));

  }

  const attachRef = (el) => {
    containerRef.current = el;
    loadRef('platformRef', containerRef);
  }

  useEffect(() => {

    handleEnableInitialIntroModal();

  }, []);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <main className={P.container} ref={attachRef}>
        <Header />

        <Sidebar />

        <Outlet context={containerRef} />

        <ActionsArea />
      </main>

      {isMobile && <CustomDragLayer />}
    </DndProvider>
  )
}

export default Platform;
