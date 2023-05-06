import { useState } from 'react';
import { useDrop } from 'react-dnd';

import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';

import { menu } from './styles.module.css';

const Sidebar = ({ deleteDevice }) => {

    const [currentArea, setCurrentArea] = useState('entry');

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'device',
        drop: (item) => deleteDevice(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), []);

    const handleSelectArea = (currentArea) => {
        setCurrentArea(currentArea);
    }

    return (
        <nav
            className={menu}
            ref={drop}
        >
            <MenuButtons
                handleSelectArea={handleSelectArea}
                area={currentArea}
            />
            <SidebarArea
                area={currentArea}
                activeTrashArea={isOver}
            />

        </nav>
    );
};

export default Sidebar;