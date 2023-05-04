import ModalContainer from "..";

const ConfigLedModal = ({
    modalIsOpen, closeModal
}) => {
    return (
        <ModalContainer
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
        >
            <h1>Led</h1>
        </ModalContainer>
    );
};

export default ConfigLedModal;