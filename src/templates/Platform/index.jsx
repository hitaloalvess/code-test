
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

import { ModalProvider } from '@/contexts/ModalContext';
import { DevicesProvider } from '@/contexts/DevicesContext';
import { FlowProvider } from '@/contexts/FlowContext';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ManualButton from '@/components/ManualButton';
import ZoomButton from '@/components/ZoomButton';
import FaqButton from '@/components/FaqButton';
import MoutingPanel from '@/components/MoutingPanel';
import CustomDragLayer from '@/components/CustomDragLayer';

import { container, buttonsContainer } from './styles.module.css';


const Platform = () => {

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <ModalProvider>
        <DevicesProvider>
          <FlowProvider>
            <main className={container}>
              <Header />

              <Sidebar />

              <MoutingPanel />

              <div className={buttonsContainer}>
                <ManualButton />
                <FaqButton />
                <ZoomButton />
              </div>
            </main>
          </FlowProvider>
        </DevicesProvider>
      </ModalProvider>

      {isMobile && <CustomDragLayer />}
    </DndProvider>
  )
}

export default Platform;
