import imgLogoMicrodigo from '@/assets/images/logo-microdigo.svg';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import P from 'prop-types';

import ConfigLedModal from './ConfigLedModal';
import ConfigDelayModal from './ConfigDelayModal';
import ConfigBuzzerModal from './ConfigBuzzerModal';
import ConfigSliderModal from './ConfigSliderModal';
import ConfirmationModal from './ConfirmationModal';

import {
  container,
  header,
  btnClose
} from './styles.module.css';
import ConfigDhtModal from './ConfigDhtModal';

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
    'confirmation': <ConfirmationModal
      closeModal={closeModal}
      contentData={contentData}
    />,
    'config-led': <ConfigLedModal
      closeModal={closeModal}
      contentData={contentData}
    />,
    'config-buzzer': <ConfigBuzzerModal
    closeModal={closeModal}
    contentData={contentData}
    />,
    'config-delay': <ConfigDelayModal
    closeModal={closeModal}
    contentData={contentData}
    />,
    'config-slider': <ConfigSliderModal
    closeModal={closeModal}
    contentData={contentData}
    />,
    'config-dht': <ConfigDhtModal
    closeModal={closeModal}
    contentData={contentData}
    />
  }

  const currentContent = contents[contentData.typeContent];

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
      {currentContent}
    </Modal>
  );
};

ModalContainer.propTypes = {
  modalIsOpen: P.bool.isRequired,
  closeModal: P.func.isRequired,
  contentData: P.object.isRequired
}

export default ModalContainer;
