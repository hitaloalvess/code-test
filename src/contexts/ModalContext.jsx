import { createContext, useState } from "react"
import ModalContainer from "@/components/Modal";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [contentData, setContentData] = useState({});

    const enableModal = (data) => {
        setContentData(data);
        setModalIsOpen(true);
    };

    const disableModal = () => {
        setModalIsOpen(false);
        setContentData({});
    };

    return (
        <ModalContext.Provider
            value={{ modalIsOpen, enableModal, disableModal }}
        >
            <ModalContainer
                contentData={contentData}
                modalIsOpen={modalIsOpen}
                closeModal={disableModal}
            />
            {children}
        </ModalContext.Provider>
    )
}

