import P from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';

import { useModal } from '@/hooks/useModal';

import * as PC from './styles.module.css';

const ProjectCard = ({ data, onDelete, onUpdate }) => {
  const { id, name, createdAt, description } = data;

  const { enableModal, disableModal } = useModal();
  const navigate = useNavigate();

  const handleOpen = () => navigate(`/plataforma/projeto/${id}`);

  const handleDelete = (event) => {
    event.stopPropagation();

    enableModal({
      typeContent: 'confirmation',
      subtitle: 'Tem certeza que deseja excluir esse projeto?',
      handleConfirm: async () => {

        await onDelete.mutateAsync(id);
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

        await onUpdate.mutateAsync(newProject);
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
          <p className={PC.projectCardCreatedAt}>{createdAt}</p>

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
    createdAt: P.string.isRequired,
    description: P.string.isRequired,
  }).isRequired,
  onDelete: P.object.isRequired,
  onUpdate: P.object.isRequired
}

export default ProjectCard;
