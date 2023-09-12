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
import ActionsArea from './ActionsArea';


import { moutingPanelContainer } from './styles.module.css';

const MoutingPanel = () => {

  const { id: projectId } = useParams();

  const containerRef = useOutletContext();

  const { startMove, endMove, moving } = useScroll(containerRef);

  const { loadProject } = useProject();

  const {
    insertDevice,
    repositionDevice,
    cleanMoutingPanel
  } = useStore(store => ({
    insertDevice: store.insertDevice,
    repositionDevice: store.repositionDevice,
    cleanMoutingPanel: store.cleanMoutingPanel
  }), shallow);

  const isFirstRender = useRef(true);

  const moutingPanelRef = useRef(null);

  const attachRef = (el) => {
    drop(el);
    moutingPanelRef.current = el;
  }


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
  }), []);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    loadProject(projectId)
      .catch(error => console.log(error));

    return () => {
      cleanMoutingPanel();
    }
  }, [projectId]);


  return (
    <div
      className={moutingPanelContainer}
      ref={attachRef}
      onMouseDown={startMove}
      onMouseUp={endMove}
      onMouseMove={moving}
    >

      <DevicesArea />

      <LinesContainer />

      <BackgroundGrade
        moutingPanelRef={moutingPanelRef}
      />

      <ActionsArea />

    </div>
  );
};

export default MoutingPanel;
