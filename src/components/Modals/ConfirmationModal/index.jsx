import ModalContainer from "..";

const ConfirmationModal = ({
    modalIsOpen, closeModal
}) => {
    return (
        <ModalContainer
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
        >
            <h1>CONFIRMATION CONTENT</h1>
        </ModalContainer>
    );
};

export default ConfirmationModal;