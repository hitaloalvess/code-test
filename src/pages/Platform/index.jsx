
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

import { DevicesProvider } from '@/contexts/DevicesContext';
import { FlowProvider } from '@/contexts/FlowContext';

import Header from '@/components/Header';
import Sidebar from '@/components/Platform/Sidebar';

import MoutingPanel from '@/components/Platform/MoutingPanel';
import CustomDragLayer from '@/components/Platform/CustomDragLayer';

import { container } from './styles.module.css';
import { useRef } from 'react';


const Platform = () => {
  const containerRef = useRef(null);

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <DevicesProvider>
        <FlowProvider>
          <main className={container} ref={containerRef}>
            <Header />

            <Sidebar />

            <MoutingPanel ref={containerRef} />


          </main>
        </FlowProvider>
      </DevicesProvider>

      {isMobile && <CustomDragLayer />}
    </DndProvider>
  )
}

export default Platform;
