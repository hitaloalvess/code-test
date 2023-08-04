import { createContext, useState } from "react"
import ModalContainer from "@/components/shared/Modal";
import P from 'prop-types';

import ConfigLedModal from '@/components/shared/Modal/ConfigLedModal';
import ConfigDelayModal from '@/components/shared/Modal/ConfigDelayModal';
import ConfigBuzzerModal from '@/components/shared/Modal/ConfigBuzzerModal';
import ConfigSliderModal from '@/components/shared/Modal/ConfigSliderModal';
import ConfirmationModal from '@/components/shared/Modal/ConfirmationModal';
import ConfigDhtModal from '@/components/shared/Modal/ConfigDhtModal';
import ConfigIfModal from '@/components/shared/Modal/ConfigIfModal';
import ConfigPickColorModal from '@/components/shared/Modal/ConfigPickColorModal';
import UpdatePasswordModal from '@/components/shared/Modal/UpdatePasswordModal';
import SearchFormModal from '@/components/shared/Modal/SearchFormModal';
import FaqModal from '@/components/shared/Modal/FaqModal';
import TermsOfUseModal from '@/components/shared/Modal/TermsOfUseModal';
import InitialIntroPlatformModal from '@/components/shared/Modal/InitialIntroPlatformModal';
import { useMemo } from "react";

export const ModalContext = createContext();

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
  'terms-of-use': TermsOfUseModal,
  'initial-intro-platform': InitialIntroPlatformModal
}

export const ModalProvider = ({ children }) => {

  const [listEnabledModals, setListEnabledModals] = useState([]);

  const enableModal = (data) => {
    setListEnabledModals(prevModals => [
      ...prevModals,
      {
        Component: contents[data.typeContent],
        ...data
      }
    ]);

  };

  const disableModal = (typeContent) => {
    const newModals = listEnabledModals.filter(modal => modal.typeContent !== typeContent);

    setListEnabledModals(newModals);
  };

  const modalIsOpen = useMemo(() => {
    if (listEnabledModals.length > 0) return true;

    return false;
  }, [listEnabledModals])

  return (
    <ModalContext.Provider
      value={{ modalIsOpen, enableModal, disableModal }}
    >
      <ModalContainer
        enabledModals={listEnabledModals}
        modalIsOpen={modalIsOpen}
        onClose={disableModal}
      />
      {children}
    </ModalContext.Provider>
  )
}

ModalProvider.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}
