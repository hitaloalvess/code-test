import P from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';

import { useModal } from '@/hooks/useModal';

import * as PC from './styles.module.css';

const ProjectCard = ({ data, onDelete, onUpdate }) => {
  const { id, name, created_at, description } = data;

  const { enableModal, disableModal } = useModal();
  const navigate = useNavigate();

  const handleOpen = () => navigate(`/plataforma/projeto/${id}`);

  const handleDelete = (event) => {
    event.stopPropagation();

    enableModal({
      typeContent: 'confirmation',
      title: 'Tem certeza que deseja excluir esse projeto?',
      handleConfirm: async () => {

        onDelete(id);
        disableModal('confirmation');

      }
    });
  }

  const handleUpdate = (event) => {
    event.stopPropagation();

    enableModal({
      typeContent: 'create-project',
      title: 'Atualizar projeto',
      project: {
        id,
        name,
        description,
      },
      handleConfirm: async (newProject) => {

        onUpdate(newProject);
        disableModal('create-project');

      }
    });
  }

  return (
    <li
      className={PC.projectCardContainer}
      onClick={handleOpen}
    >

      <div className={PC.projectCardHeader}>
        <h2>{name}</h2>
      </div>

      <div className={PC.projectCardContent}>
        <p className={PC.projectCardDescription}>{description}</p>

        <div className={PC.projectCardInfo}>
          <p className={PC.projectCardCreatedAt}>{created_at}</p>

          <span className={PC.projectCardActions}>
            <button
              className={`${PC.projectCardAction} ${PC.projectCardActionDelete}`}
              onClick={handleDelete}
            >
              <Trash fontSize={16} />
            </button>

            <button
              className={`${PC.projectCardAction} ${PC.projectCardActionEdit}`}
              onClick={handleUpdate}
            >
              <PencilSimpleLine fontSize={16} />
            </button>
          </span>
        </div>
      </div>
    </li>
  );
};

ProjectCard.propTypes = {
  data: P.shape({
    id: P.string.isRequired,
    name: P.string.isRequired,
    created_at: P.string.isRequired,
    description: P.string.isRequired,
  }).isRequired,
  onDelete: P.func.isRequired,
  onUpdate: P.func.isRequired
}

export default ProjectCard;
