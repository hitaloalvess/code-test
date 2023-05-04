import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
    overlay: {
        zIndex: 100
    }
};

const ModalContainer = ({ modalIsOpen, closeModal, children }) => {

    return (
        <Modal
            style={customStyles}
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel='Example Modal'
        >
            <button
                onClick={closeModal}
            >
                X
            </button>
            {children}
        </Modal>
    );
};

export default ModalContainer;