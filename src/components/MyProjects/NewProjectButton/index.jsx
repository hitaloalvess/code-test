import { useNavigate } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react';
import P from 'prop-types';

import { useModal } from '@/hooks/useModal';

import *  as C from '@/styles/common.module.css';

const NewProjectButton = ({ onCreate }) => {

  const navigate = useNavigate();
  const { enableModal } = useModal();

  const handleNewProject = () => {
    enableModal({
      typeContent: 'create-project',
      title: 'Novo projeto',
      handleConfirm: (newProject) => {
        const projectId = onCreate(newProject);

        navigate(`/plataforma/projeto/${projectId}`);

      }
    });
  }

  return (
    <button
      className={`${C.btn} ${C.btnBlue}`}
      onClick={handleNewProject}
    >
      Novo projeto
      <Plus />
    </button>
  );
};

NewProjectButton.propTypes = {
  onCreate: P.func.isRequired
}

export default NewProjectButton;
