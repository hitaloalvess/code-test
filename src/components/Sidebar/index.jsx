import { useState } from 'react';

import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';

import { menu } from './styles.module.css';

const Sidebar = () => {

    const [currentArea, setCurrentArea] = useState('entry');

    const handleSelectArea = (currentArea) => {
        setCurrentArea(currentArea);
    }

    return (
        <nav className={menu}>
            <MenuButtons
                handleSelectArea={handleSelectArea}
                area={currentArea}
            />
            <SidebarArea area={currentArea} />
        </nav>
    );
};

export default Sidebar;