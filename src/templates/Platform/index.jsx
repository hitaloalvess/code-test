
import { container, buttonsContainer } from './styles.module.css';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ManualButton from '@/components/ManualButton';
import ZoomButton from '@/components/ZoomButton';
import FaqButton from '@/components/FaqButton';
import MoutingPanel from '../../components/MoutingPanel';



const Platform = () => (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
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
    </DndProvider>
)

export default Platform;