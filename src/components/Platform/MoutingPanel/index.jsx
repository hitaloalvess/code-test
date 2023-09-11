/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect, forwardRef } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { useScroll } from '@/hooks/useScroll';
import { useContextAuth } from '@/hooks/useAuth';
import { useProject } from '@/hooks/useProject';

import DevicesArea from './DevicesArea';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';
import ManualButton from './CircleButton/ManualButton';
import ZoomButton from './CircleButton/ZoomButton';
import FaqButton from './CircleButton/FaqButton';
import SearchFormButton from './CircleButton/SearchFormButton';

import { moutingPanelContainer, buttonsContainer } from './styles.module.css';

const MoutingPanel = () => {
  console.log('re-render mouting panel');

  const { id: projectId } = useParams();
  const containerRef = useOutletContext();
  const { startMove, endMove, moving } = useScroll(containerRef);
  const { searchFormHasEnabled } = useContextAuth();
  const { project, loadProject, saveProject } = useProject();
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

      <div className={buttonsContainer}>
        <ManualButton />
        <FaqButton />
        {searchFormHasEnabled && (<SearchFormButton />)}
        <ZoomButton />

        <button
          onClick={saveProject}
        >
          Save
        </button>
      </div>

    </div>
  );
};

export default MoutingPanel;
