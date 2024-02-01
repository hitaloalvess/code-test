import { createContext, useState, useMemo } from "react"
import P from 'prop-types';

import ModalContainer from "@/components/SharedComponents/Modal";
import ConfigLedModal from '@/components/SharedComponents/Modal/ConfigLedModal';
import ConfigDelayModal from '@/components/SharedComponents/Modal/ConfigDelayModal';
import ConfigBuzzerModal from '@/components/SharedComponents/Modal/ConfigBuzzerModal';
import ConfigSliderModal from '@/components/SharedComponents/Modal/ConfigSliderModal';
import ConfirmationModal from '@/components/SharedComponents/Modal/ConfirmationModal';
import ConfigClimateModal from '@/components/SharedComponents/Modal/ConfigClimateModal';
import ConfigComparatorModal from '@/components/SharedComponents/Modal/ConfigComparatorModal';
import ConfigPickColorModal from '@/components/SharedComponents/Modal/ConfigPickColorModal';
import UpdatePasswordModal from '@/components/SharedComponents/Modal/UpdatePasswordModal';
import SearchFormModal from '@/components/SharedComponents/Modal/SearchFormModal';
import FaqModal from '@/components/SharedComponents/Modal/FaqModal';
import TermsOfUseModal from '@/components/SharedComponents/Modal/TermsOfUseModal';
import InitialIntroPlatformModal from '@/components/SharedComponents/Modal/InitialIntroPlatformModal';
import CreateProjectModal from "@/components/SharedComponents/Modal/CreateProjectModal";
import ConfigCounterModal from '@/components/SharedComponents/Modal/ConfigCounterModal';
import ConfigLoopModal from '@/components/SharedComponents/Modal/ConfigLoopModal';
import ConfigStickyNoteModal from '@/components/SharedComponents/Modal/ConfigStickyNoteModal';
import ConfigPassValueModal from '@/components/SharedComponents/Modal/ConfigPassValueModal';
import ConnectDevice from '@/components/SharedComponents/Modal/ConnectDeviceModal';
export const ModalContext = createContext();

const contents = {
  'confirmation': ConfirmationModal,
  'config-led': ConfigLedModal,
  'config-buzzer': ConfigBuzzerModal,
  'config-delay': ConfigDelayModal,
  'config-slider': ConfigSliderModal,
  'config-climate': ConfigClimateModal,
  'config-comparator': ConfigComparatorModal,
  'config-pickColor': ConfigPickColorModal,
  'update-password': UpdatePasswordModal,
  'search-form': SearchFormModal,
  'faq': FaqModal,
  'terms-of-use': TermsOfUseModal,
  'initial-intro-platform': InitialIntroPlatformModal,
  'create-project': CreateProjectModal,
  'config-counter': ConfigCounterModal,
  'config-loop': ConfigLoopModal,
  'config-stickyNote': ConfigStickyNoteModal,
  'config-passValue': ConfigPassValueModal,
  'connect-device': ConnectDevice
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

  const disableModal = (typeContent = null) => {

    if (!typeContent) {
      setListEnabledModals([]);

      return;
    }

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
