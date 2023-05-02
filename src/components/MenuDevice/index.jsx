import { useDrag } from 'react-dnd';
import { deviceItemContent, deviceItemContainer } from './styles.module.css';
import { useState } from 'react';

const MenuDevice = ({ device }) => {

    const [refDevice, setRefDevice] = useState(null);

    const [_, drag] = useDrag(() => ({
        type: 'device',
        item: {
            ...device,
            draggedDevice: refDevice
        },
    }), [refDevice]);

    return (
        <li className={deviceItemContainer}>
            <div
                className={deviceItemContent}
                ref={(content) => {
                    drag(content);
                    setRefDevice(content);
                }}
            >
                <img
                    src={device.imgSrc}
                    alt={device.name}
                    loading='lazy'
                />
            </div>
            <p>{device.name}</p>
        </li>
    );
};

export default MenuDevice;