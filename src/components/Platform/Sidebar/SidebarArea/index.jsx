import { Trash } from '@phosphor-icons/react';
import { useSidebar } from '@/hooks/useSidebar';

import MenuDeviceVirtual from '../MenuDeviceVirtual';
import MenuDevicePhysical from '../MenuDevicePhysical';
import ButtonConnect from '../ButtonConnect';

import * as SA from './styles.module.css';
const SidebarArea = () => {

  const { activeTrashArea, devices, currentArea } = useSidebar();

  return (
    <div className={SA.container}>

      <div className={SA.devicesList}>
        <ul>{
          Object.values(devices[currentArea]).map((device) => (
            device.type === 'virtual' ?
              <MenuDeviceVirtual
                key={device.id}
                device={device}
              /> :
              <MenuDevicePhysical
                key={device.id}
                device={device}
              />
          ))
        }

          {
            currentArea === 'hardware' &&
            <ButtonConnect />
          }
        </ul>
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
export default SidebarArea;
