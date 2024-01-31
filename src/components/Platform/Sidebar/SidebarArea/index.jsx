import { Trash } from '@phosphor-icons/react';
import P from 'prop-types';

import * as SA from './styles.module.css';
const SidebarArea = ({ activeTrashArea, children }) => {

  return (
    <div className={SA.container}>

      <div className={SA.devicesList}>
        <ul>{children}</ul>
      </div>
      {activeTrashArea && (
        <div
          className={SA.trashArea}
        >
          <Trash />
        </div>
      )}
    </div>
  );
};

SidebarArea.propTypes = {
  activeTrashArea: P.bool.isRequired,
  onAddDeviceInSidebar: P.func.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
  ])
}

export default SidebarArea;
