import { useState } from "react"

export const useModal = (initialState = false) => {
    const [modalIsOpen, setModalIsOpen] = useState(initialState);

    const enableModal = () => setModalIsOpen(true);

    const disableModal = () => setModalIsOpen(false);

    return [modalIsOpen, enableModal, disableModal];
}