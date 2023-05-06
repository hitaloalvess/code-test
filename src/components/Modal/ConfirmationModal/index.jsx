import { FaExclamationTriangle } from 'react-icons/fa';

import ModalContainer from "..";

import {
    confirmationModalContent,
    confirmationModalHeader,
    confirmationModalTitle,
    confirmationModalMsg,
    confirmModalActions
} from './styles.module.css';

import {
    btn,
    btnBlue,
    btnCancel
} from '@/styles/common.module.css';

const ConfirmationModal = ({
    closeModal, contentData
}) => {
    const { title, subtitle, handleConfirm } = contentData;
    return (

        <section
            className={confirmationModalContent}
        >
            <header
                className={confirmationModalHeader}
            >

                <FaExclamationTriangle />

                <h1
                    className={confirmationModalTitle}
                >
                    {title}
                </h1>

                <p
                    className={confirmationModalMsg}
                >
                    {subtitle}
                </p>
            </header>

            <div
                className={confirmModalActions}
            >
                <button
                    className={`${btn} ${btnBlue}`}
                    onClick={handleConfirm}
                >
                    Confirmar
                </button>
                <button
                    className={`${btn} ${btnCancel}`}
                    onClick={closeModal}
                >
                    Cancel
                </button>
            </div>
        </section>
    );
};

export default ConfirmationModal;