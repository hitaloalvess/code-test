import { useProject } from '@/hooks/useProject';
import { useContextAuth } from '@/hooks/useAuth';
import { useParams } from 'react-router';

import ManualButton from './CircleButton/ManualButton';
import ZoomButton from './CircleButton/ZoomButton';
import FaqButton from './CircleButton/FaqButton';
import SearchFormButton from './CircleButton/SearchFormButton';

import * as A from './styles.module.css';

const ActionsArea = () => {

  const { searchFormHasEnabled } = useContextAuth();
  const { id: projectId } = useParams();
  const { saveProject } = useProject();


  return (
    <aside className={A.actionsContainer}>
      <ManualButton />

      <FaqButton />

      {searchFormHasEnabled && (<SearchFormButton />)}

      <ZoomButton />

      <button
        onClick={() => saveProject(projectId)}
      >
        Save
      </button>
    </aside>
  );
};

export default ActionsArea;
