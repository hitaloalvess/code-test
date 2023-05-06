import { FaTrashAlt } from 'react-icons/fa';
import { mockDevices } from '@/data/devices.js';

import MenuDevice from '../MenuDevice';

import { container, trashArea } from './styles.module.css';

const SidebarArea = ({ area, activeTrashArea }) => {
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
            {activeTrashArea && (
                <div
                    className={trashArea}
                >
                    <FaTrashAlt />
                </div>
            )}
        </div>
    );
};

export default SidebarArea;