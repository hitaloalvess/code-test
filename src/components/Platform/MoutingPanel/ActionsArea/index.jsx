import { useProject } from '@/hooks/useProject';
import { useContextAuth } from '@/hooks/useAuth';

import ManualButton from './CircleButton/ManualButton';
import ZoomButton from './CircleButton/ZoomButton';
import FaqButton from './CircleButton/FaqButton';
import SearchFormButton from './CircleButton/SearchFormButton';

import * as A from './styles.module.css';

const ActionsArea = () => {

  const { searchFormHasEnabled } = useContextAuth();
  const { saveProject } = useProject();


  return (
    <aside className={A.actionsContainer}>
      <ManualButton />

      <FaqButton />

      {searchFormHasEnabled && (<SearchFormButton />)}

      <ZoomButton />

      <button
        onClick={saveProject}
      >
        Save
      </button>
    </aside>
  );
};

export default ActionsArea;
