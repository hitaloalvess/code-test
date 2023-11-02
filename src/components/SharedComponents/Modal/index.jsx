import imgLogoMicrodigo from '@/assets/images/logo-microdigo.svg';
import Modal from 'react-modal';
import { X } from '@phosphor-icons/react'
import P from 'prop-types';

import * as M from './styles.module.css';


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

const ModalContainer = ({ modalIsOpen, onClose, enabledModals }) => {

  return (
    <>
      {
        enabledModals.map(({ Component, ...modal }, index) => (
          <Modal
            style={customStyles}
            isOpen={modalIsOpen}
            onRequestClose={() => onClose(modal.typeContent)}
            contentLabel='Example Modal'
            className={M.container}
            shouldCloseOnOverlayClick={false}
            key={index}
          >
            <>
              <header className={M.header}>
                <img
                  src={imgLogoMicrodigo}
                  alt="logo microdigo"
                  loading='lazy'
                />

                <button
                  className={M.btnClose}
                  onClick={() => onClose(modal.typeContent)}
                >
                  <X />
                </button>
              </header>

              <Component
                closeModal={() => onClose(modal.typeContent)}
                contentData={modal}
              />

            </>
          </Modal >
        ))
      }
    </>

  );
};

ModalContainer.propTypes = {
  modalIsOpen: P.bool.isRequired,
  onClose: P.func.isRequired,
  enabledModals: P.array.isRequired
}

export default ModalContainer;
