import { Plus } from '@phosphor-icons/react';
import P from 'prop-types';

import { useModal } from '@/hooks/useModal';

import *  as C from '@/styles/common.module.css';
import * as NPB from './styles.module.css';

import { toast } from 'react-toastify';

const NewProjectButton = ({ onCreate }) => {

  const { enableModal } = useModal();

  const handleNewProject = async () => {
    enableModal({
      typeContent: 'create-project',
      title: 'Novo projeto',
      handleConfirm: async (newProject) => {
        try {

          await onCreate.mutateAsync(newProject);

        } catch (error) {
          toast.error(error.response.data.message);
        }

      }
    });
  }

  return (
    <button
      className={`${C.btn} ${C.btnBlue} ${NPB.newProjectBtn}`}
      onClick={handleNewProject}
    >
      <p>Novo projeto</p>
      <Plus />
    </button>
  );
};

NewProjectButton.propTypes = {
  onCreate: P.object.isRequired
}

export default NewProjectButton;
