import imgLogoMicrodigo from '@/assets/images/logo-microdigo.svg';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

import {
    container,
    header,
    btnClose
} from './styles.module.css';

const customStyles = {
    overlay: {
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(40, 40, 50, 0.3)',
        backdropFilter: 'blur(8px)',
    }
};

const ModalContainer = ({ modalIsOpen, closeModal, children }) => {

    return (
        <Modal
            style={customStyles}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel='Example Modal'
            className={container}
        >

            <header className={header}>
                <img
                    src={imgLogoMicrodigo}
                    alt="logo microdigo"
                    loading='lazy'
                />

                <button
                    className={btnClose}
                    onClick={closeModal}
                >
                    <FaTimes />
                </button>
            </header>
            {children}
        </Modal>
    );
};

export default ModalContainer;