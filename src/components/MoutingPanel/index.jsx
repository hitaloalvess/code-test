import React, { useRef, useState } from 'react';
import { useDrop, useDragDropManager } from 'react-dnd';
import { v4 } from 'uuid';

import { positionDevice } from '../../utils/devices-functions';
import Device from '@/components/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';

import { moutingPanelContainer } from './styles.module.css';

const MoutingPanel = () => {
    const [devices, setDevices] = useState([]);
    const monitor = useDragDropManager().getMonitor();
    const moutingPanelRef = useRef(null);

    const [_, drop] = useDrop(() => ({
        accept: 'device',
        drop: (item) => addDevice(item, devices)
    }), [devices]);

    const addDevice = (item, devices) => {
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
    }

    const attachRef = (el) => {
        drop(el);
        moutingPanelRef.current = el;
    }

    return (
        <div
            className={moutingPanelContainer}
            ref={attachRef}
        >
            {
                devices.map(device => (
                    <Device key={device.id} device={device} />
                ))
            }
            <LinesContainer />

            <BackgroundGrade moutingPanelRef={moutingPanelRef} />
        </div>
    );
};

export default MoutingPanel;