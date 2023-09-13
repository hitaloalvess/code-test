import { Warning } from '@phosphor-icons/react';
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
  const { title, subtitle, handleConfirm, notRenderCancel } = contentData;
  return (

    <section
      className={confirmationModalContent}
    >
      <header
        className={confirmationModalHeader}
      >

        <Warning />

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
        {
          !notRenderCancel && (
            <button
              className={`${btn} ${btnCancel}`}
              onClick={closeModal}
            >
              Cancel
            </button>
          )
        }
      </div>
    </section>
  );
};

ConfirmationModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    title: P.string,
    subtitle: P.string,
    handleConfirm: P.func,
    notRenderCancel: P.bool
  }).isRequired
}

export default ConfirmationModal;
