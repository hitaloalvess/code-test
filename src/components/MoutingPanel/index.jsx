import React, { useCallback, useRef, useState } from 'react';
import { useDrop, useDragDropManager } from 'react-dnd';

import Device from '@/components/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';

import { moutingPanelContainer } from './styles.module.css';

const MoutingPanel = ({ devices, deleteDevice, addDevice }) => {
    const monitor = useDragDropManager().getMonitor();
    const moutingPanelRef = useRef(null);

    const attachRef = (el) => {
        drop(el);
        moutingPanelRef.current = el;
    }

    const [_, drop] = useDrop(() => ({
        accept: ['device', 'menu-device'],
        drop: (item, monitor) => addDevice(item, devices, monitor)
    }), [devices]);

    return (
        <div
            className={moutingPanelContainer}
            ref={attachRef}
        >
            {
                devices.map(device => (
                    <Device
                        key={device.id}
                        device={{
                            ...device,
                            handleDelete: deleteDevice
                        }}
                    />
                ))
            }
            <LinesContainer />

            <BackgroundGrade moutingPanelRef={moutingPanelRef} />
        </div>
    );
};

export default MoutingPanel;