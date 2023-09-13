import P from 'prop-types';

import * as TI from './styles.module.css';

const ToggleIcon = ({ active }) => {
  return (
    <>
      <input
        type="checkbox"
        checked={active}
        className={TI.toggleInput}
        readOnly={true}
      />
      <label className={TI.toggleLabel}></label>
    </>
  );
};

ToggleIcon.propTypes = {
  active: P.bool.isRequired
}

export default ToggleIcon;
