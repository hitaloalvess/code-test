import { mockDevices } from '@/data/devices.js';

import MenuDevice from '../MenuDevice';

import { container } from './styles.module.css';

const SidebarArea = ({ area }) => {
    return (
        <div className={container}>
            {
                <ul>
                    {
                        mockDevices[area]
                            .map((device) => (
                                <MenuDevice
                                    key={device.id}
                                    device={device}
                                />
                            ))
                    }
                </ul>
            }
        </div>
    );
};

export default SidebarArea;