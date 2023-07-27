import { useMemo } from 'react';
import imgLogoMicrodigo from '@/assets/images/logo-microdigo.svg';
import Modal from 'react-modal';
import { X } from '@phosphor-icons/react'
import P from 'prop-types';

import ConfigLedModal from './ConfigLedModal';
import ConfigDelayModal from './ConfigDelayModal';
import ConfigBuzzerModal from './ConfigBuzzerModal';
import ConfigSliderModal from './ConfigSliderModal';
import ConfirmationModal from './ConfirmationModal';
import ConfigDhtModal from './ConfigDhtModal';
import ConfigIfModal from './ConfigIfModal';
import ConfigPickColorModal from './ConfigPickColorModal';
import UpdatePasswordModal from './UpdatePasswordModal';
import SearchFormModal from './SearchFormModal';
import FaqModal from './FaqModal';
import TermsOfUseModal from './TermsOfUseModal';

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

const ModalContainer = ({ modalIsOpen, closeModal, contentData }) => {
  const contents = {
    'confirmation': ConfirmationModal,
    'config-led': ConfigLedModal,
    'config-buzzer': ConfigBuzzerModal,
    'config-delay': ConfigDelayModal,
    'config-slider': ConfigSliderModal,
    'config-dht': ConfigDhtModal,
    'config-if': ConfigIfModal,
    'config-pickColor': ConfigPickColorModal,
    'update-password': UpdatePasswordModal,
    'search-form': SearchFormModal,
    'faq': FaqModal,
    'terms-of-use': TermsOfUseModal
  }

  const CurrentContent = useMemo(() => {
    return contents[contentData.typeContent];
  }, [contentData.typeContent]);

  if (!CurrentContent) {
    return;
  }

  return (
    <Modal
      style={customStyles}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel='Example Modal'
      className={container}
      shouldCloseOnOverlayClick={false}
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
          <X />
        </button>
      </header>
      {
        <CurrentContent
          closeModal={closeModal}
          contentData={contentData}
        />
      }
    </Modal>
  );
};

ModalContainer.propTypes = {
  modalIsOpen: P.bool.isRequired,
  closeModal: P.func.isRequired,
  contentData: P.object.isRequired
}

export default ModalContainer;
