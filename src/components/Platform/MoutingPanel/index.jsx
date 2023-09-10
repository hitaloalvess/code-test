/* eslint-disable no-unused-vars */
import {
  useRef, useState, forwardRef, /*, useEffect */
  useEffect
} from 'react';
import { useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';

import { useContextAuth } from '@/hooks/useAuth';
import { useProject } from '@/hooks/useProject';

import Device from '@/components/Platform/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';
import ManualButton from './CircleButton/ManualButton';
import ZoomButton from './CircleButton/ZoomButton';
import FaqButton from './CircleButton/FaqButton';
import SearchFormButton from './CircleButton/SearchFormButton';

import { moutingPanelContainer, buttonsContainer } from './styles.module.css';

import { useStore } from '@/store';
import { shallow } from 'zustand/shallow';

const MoutingPanel = () => {
  const { id: projectId } = useParams();

  const { searchFormHasEnabled } = useContextAuth();
  const { getProjects, saveProject } = useProject();

  const {
    devices,
    flows,
    loadDevice,
    createFlow,
    insertDevice,
    repositionDevice,
    loadMoutingPanel
  } = useStore(store => ({
    devices: store.devices,
    flows: store.flows,
    loadDevice: store.loadDevice,
    createFlow: store.createFlow,
    insertDevice: store.insertDevice,
    repositionDevice: store.repositionDevice,
    loadMoutingPanel: store.loadMoutingPanel
  }), shallow);

  const isFirstRender = useRef(true);
  const moutingPanelRef = useRef(null);

  const [project, setProject] = useState();
  const [changingScrollPos, setChangingScrollPos] = useState({
    moving: false,
    posX: 0,
    posY: 0,
    posTop: 0,
    posLeft: 0
  });

  const attachRef = (el) => {
    drop(el);
    moutingPanelRef.current = el;
    loadMoutingPanel(moutingPanelRef);
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

  const handleMouseDown = (event) => {
    //Valid if the element to be dragged is the line container,
    //this way the scroll will only be moved when we drag the container
    const isLinesContainer = event.target.id.includes('lines');

    if (!isLinesContainer) return;

    const scrollElement = moutingPanelRef.current;
    const { clientX, clientY } = event;

    setChangingScrollPos({
      moving: true,
      posLeft: scrollElement.scrollLeft,
      posTop: scrollElement.scrollTop,
      posX: clientX,
      posY: clientY
    })

  }

  const handleMouseUp = () => {
    setChangingScrollPos({
      moving: false,
      posX: 0,
      posY: 0,
      posTop: 0,
      posLeft: 0
    });

    moutingPanelRef.current.style.cursor = 'grab';
  }

  const handleMouseMove = (event) => {
    const { posX, posY, posLeft, posTop, moving } = changingScrollPos;

    if (!moving) return;

    const scrollElement = moutingPanelRef.current;

    const { clientX, clientY } = event;

    const distanceX = clientX - posX;
    const distanceY = clientY - posY;

    scrollElement.scrollTop = posTop - distanceY;
    scrollElement.scrollLeft = posLeft - distanceX;

    moutingPanelRef.current.style.cursor = 'grabbing';

  }

  const handleLoadProject = async ({ projectId }) => {

    const projects = getProjects();
    const project = projects.find(project => project.id === projectId);


    const deviceList = Object.values(project.devices).map(async (device) => {
      loadDevice({ ...device, moutingPanelRef }); //REMOVER containerREF depois
      await new Promise(resolve => setTimeout(resolve, 100))
    });


    await Promise.all(deviceList);


    Object.values(project.flows).forEach(flow => {
      flow.connections.forEach(connection => {
        createFlow({
          devices: {
            from: connection.deviceFrom,
            to: connection.deviceTo
          }
        })
      })
    })

    return project;
  }


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    handleLoadProject({ projectId })
      .then(project => setProject(project));

  }, []);

  return (
    <div
      className={moutingPanelContainer}
      ref={attachRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >

      {
        Object.values(devices).map(device => (
          <Device
            key={device.id}
            device={device}
          />
        ))
      }

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
          onClick={() => {
            const newProject = {
              ...project,
              devices,
              flows
            }

            saveProject(newProject);
          }}
        >
          Save
        </button>
      </div>

    </div>
  );
};

export default MoutingPanel;
