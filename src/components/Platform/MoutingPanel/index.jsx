/* eslint-disable no-unused-vars */
import { useRef, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { useScroll } from '@/hooks/useScroll';
import { useProject } from '@/hooks/useProject';

import DevicesArea from './DevicesArea';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';


import * as MP from './styles.module.css';

const MoutingPanel = () => {

  const { id: projectId } = useParams();

  const containerRef = useOutletContext();
  const { loadProject } = useProject();
  const { startMove, endMove, moving } = useScroll(containerRef);


  const {
    hasProjectUpdate,
    flows,
    devices,
    insertDevice,
    repositionDevice,
    cleanMoutingPanel,
    changeHasProjectUpdate,
  } = useStore(store => ({
    hasProjectUpdate: store.hasProjectUpdate,
    flows: store.flows,
    devices: store.devices,
    insertDevice: store.insertDevice,
    repositionDevice: store.repositionDevice,
    cleanMoutingPanel: store.cleanMoutingPanel,
    changeHasProjectUpdate: store.changeHasProjectUpdate,
  }), shallow);

  const isFirstRender = useRef(true);

  const deviceDrop = (item, monitor) => {

    const itemType = monitor.getItemType();

    if (itemType === 'menu-device') {
      insertDevice({
        device: { ...item },
        dropPos: monitor.getClientOffset(),
      });

      return;
    }

    repositionDevice({
      device: { ...item },
      screenPos: monitor.getClientOffset(),
    });
  }

  const [_, drop] = useDrop(() => ({
    accept: ['device', 'menu-device'],
    drop: (item, monitor) => deviceDrop(item, monitor),
  }), [devices]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    loadProject(projectId)
      .then(() => changeHasProjectUpdate(false))
      .catch(error => console.log(error));

    return () => {
      cleanMoutingPanel();
    }
  }, [projectId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }


    if (!hasProjectUpdate) {
      changeHasProjectUpdate(true);
    }
  }, [flows, devices]);

  return (
    <div
      className={MP.moutingPanelContainer}
      ref={drop}
      onMouseDown={startMove}
      onMouseUp={endMove}
      onMouseMove={moving}
    >

      <DevicesArea />

      <LinesContainer />

      <BackgroundGrade />

    </div>
  );
};

export default MoutingPanel;
