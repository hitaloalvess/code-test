import { forwardRef } from "react";
import P from 'prop-types';
import { Check } from '@phosphor-icons/react'

import { useModal } from '@/hooks/useModal';

import * as AT from './styles.module.css';

const ButtonAcceptsTerms = forwardRef(function ButtonAcceptsTerms(
  { checkboxChange = null }, ref
) {

  const { enableModal, disableModal } = useModal();

  const handleTermsOfUse = (event) => {
    event.preventDefault();
    enableModal({
      typeContent: 'terms-of-use',
      handleConfirm: () => {
        disableModal('terms-of-use');
      },
      closeModal: disableModal
    })
  }

  return (
    <div className={AT.container}>
      <input
        ref={ref}
        id="check-termsOfUse"
        type="checkbox"
        className={AT.btnCheck}
        onChange={checkboxChange}
      />
      <label
        htmlFor="check-termsOfUse"
        className={AT.labelBtnCheck}
      >
        <Check />
      </label>

      <div className={AT.texts}>
        <p>Li e estou de acordo com os </p>
        <button
          type='button'
          className={AT.btnEnabledModal}
          onClick={handleTermsOfUse}
        >
          Termos de Uso.
        </button>
      </div>
    </div>
  );
});

ButtonAcceptsTerms.propTypes = {
  checkboxChange: P.func
}
export default ButtonAcceptsTerms;
