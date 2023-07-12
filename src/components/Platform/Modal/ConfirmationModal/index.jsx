import { FaExclamationTriangle } from 'react-icons/fa';
import P from 'prop-types';

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

ConfirmationModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    title: P.string,
    subtitle: P.string,
    handleConfirm: P.func
  }).isRequired
}

export default ConfirmationModal;
