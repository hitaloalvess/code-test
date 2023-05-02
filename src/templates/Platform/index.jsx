
import { container } from './styles.module.css';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { isMobile } from 'react-device-detect';


const Platform = () => (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <main className={container}>
        </main>
    </DndProvider>
)

export default Platform;