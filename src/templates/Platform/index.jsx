
import { container } from './styles.module.css';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { isMobile } from 'react-device-detect';
import Header from '../../components/Header';


const Platform = () => (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <main className={container}>
            <Header />
        </main>
    </DndProvider>
)

export default Platform;