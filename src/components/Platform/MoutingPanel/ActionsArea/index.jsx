import { useContextAuth } from '@/hooks/useAuth';

import ManualButton from './CircleButton/ManualButton';
import ZoomButton from './CircleButton/ZoomButton';
import FaqButton from './CircleButton/FaqButton';
import SearchFormButton from './CircleButton/SearchFormButton';

import * as A from './styles.module.css';
import SaveButton from './SaveButton';

const ActionsArea = () => {

  const { searchFormHasEnabled } = useContextAuth();

  return (
    <aside className={A.actionsContainer}>
      <ManualButton />

      <FaqButton />

      {searchFormHasEnabled && (<SearchFormButton />)}

      <ZoomButton />

      <SaveButton />
    </aside>
  );
};

export default ActionsArea;
