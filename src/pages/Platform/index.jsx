import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

import { DevicesProvider } from '@/contexts/DevicesContext';
import { FlowProvider } from '@/contexts/FlowContext';
import { useModal } from '@/hooks/useModal';
import Header from '@/components/SharedComponents/Header';
import Sidebar from '@/components/Platform/Sidebar';
import CustomDragLayer from '@/components/Platform/CustomDragLayer';

import { container } from './styles.module.css';
import { Outlet } from 'react-router-dom';


const Platform = () => {

  const { enableModal } = useModal();

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

  useEffect(() => {

    handleEnableInitialIntroModal();

  }, []);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <DevicesProvider>
        <FlowProvider>
          <main className={container} ref={containerRef}>
            <Header />

            <Sidebar />

            <Outlet context={containerRef} />

          </main>
        </FlowProvider>
      </DevicesProvider>

      {isMobile && <CustomDragLayer />}
    </DndProvider>
  )
}

export default Platform;
