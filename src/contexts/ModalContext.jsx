import { createContext, useState } from "react"
import ModalContainer from "@/components/Modal";
import P from 'prop-types';

import ConfigLedModal from '@/components/Modal/ConfigLedModal';
import ConfigDelayModal from '@/components/Modal/ConfigDelayModal';
import ConfigBuzzerModal from '@/components/Modal/ConfigBuzzerModal';
import ConfigSliderModal from '@/components/Modal/ConfigSliderModal';
import ConfirmationModal from '@/components/Modal/ConfirmationModal';
import ConfigDhtModal from '@/components/Modal/ConfigDhtModal';
import ConfigIfModal from '@/components/Modal/ConfigIfModal';
import ConfigPickColorModal from '@/components/Modal/ConfigPickColorModal';
import UpdatePasswordModal from '@/components/Modal/UpdatePasswordModal';
import SearchFormModal from '@/components/Modal/SearchFormModal';
import FaqModal from '@/components/Modal/FaqModal';
import TermsOfUseModal from '@/components/Modal/TermsOfUseModal';
import InitialIntroPlatformModal from '@/components/Modal/InitialIntroPlatformModal';
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
