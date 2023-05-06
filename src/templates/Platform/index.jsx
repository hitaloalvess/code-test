
import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { v4 } from 'uuid';

import { positionDevice } from '@/utils/devices-functions';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ManualButton from '@/components/ManualButton';
import ZoomButton from '@/components/ZoomButton';
import FaqButton from '@/components/FaqButton';
import MoutingPanel from '@/components/MoutingPanel';
import CustomDragLayer from '@/components/CustomDragLayer';

import { container, buttonsContainer } from './styles.module.css';
import { ModalProvider } from '../../contexts/ModalContext';

const Platform = () => {
    const [devices, setDevices] = useState([]);

    const handleDeleteDevice = useCallback((id) => {
        const newDevices = devices.filter(device => device.id !== id);

        setDevices(newDevices);
    }, [devices]);

    const handleAddDevice = useCallback((item, devices, monitor) => {
        const { width, height } = item.draggedDevice.getBoundingClientRect();
        const { x, y } = monitor.getClientOffset();
        const [posX, posY] = positionDevice({ x, y, width, height });

        const elementIndex = devices.find(device => device.id === item.id);

        if (!elementIndex) {
            setDevices((devices) => [...devices, {
                ...item,
                id: v4(),
                posX,
                posY
            }]);

            return;

        }

        const newListDevices = devices.map(device => {
            if (device.id === item.id) {
                return {
                    ...device,
                    posX,
                    posY
                }
            }

            return device
        })
        setDevices(newListDevices);

    }, [devices]);

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <ModalProvider>
                <main className={container}>
                    <Header />

                    <Sidebar
                        deleteDevice={handleDeleteDevice}
                    />

                    <MoutingPanel
                        devices={devices}
                        deleteDevice={handleDeleteDevice}
                        addDevice={handleAddDevice}
                    />

                    <div className={buttonsContainer}>
                        <ManualButton />
                        <FaqButton />
                        <ZoomButton />
                    </div>
                </main>
            </ModalProvider>

            {isMobile && <CustomDragLayer />}
        </DndProvider>
    )
}

export default Platform;