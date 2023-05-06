import { useState } from 'react';
import { useDrop } from 'react-dnd';

import { useModal } from '@/hooks/useModal';
import SidebarArea from './SidebarArea';
import MenuButtons from './MenuButtons';

import { menu } from './styles.module.css';

const Sidebar = ({ deleteDevice }) => {
    const { enableModal, disableModal } = useModal();
    const [currentArea, setCurrentArea] = useState('entry');

    const handleDeleteDevice = (id) => {
        enableModal({
            typeContent: 'confirmation',
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            handleConfirm: () => {
                deleteDevice(id);
                disableModal();
            }
        })
    }
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'device',
        drop: (item) => handleDeleteDevice(item.id),
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