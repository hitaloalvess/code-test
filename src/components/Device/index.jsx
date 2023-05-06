import { memo } from 'react';
import Ldr from './Ldr';
import Led from './Led';

import {
    deviceContainer,
    deviceContent
} from './styles.module.css';

const Device = ({ device: { posX, posY, ...device } }) => {
    const devices = {
        'ldr': <Ldr {...device} />,
        'led': <Led {...device} />
    }

    const currentDevice = devices[device.name];

    if (!currentDevice) {
        return;
    }

    return (
        <div
            className={deviceContainer}
            style={{ left: `${posX}px`, top: `${posY}px` }}
        >
            <div
                className={deviceContent}
            >
                {currentDevice}
            </div>
        </div>
    )
};

export default memo(Device);