/* eslint-disable no-unused-vars */
import {
  useRef, useState, forwardRef, /*, useEffect */
  useEffect
} from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDrop } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
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


const MoutingPanel = () => {

  const containerRef = useOutletContext();
  const { id: projectId } = useParams();

  const { getProjects, saveProject } = useProject();
  const { devices, addDevice, repositionDevice, setDevice } = useDevices();
  const { flows, connectionLines, updateLines, updateFlow, createFlow } = useFlow();
  const { searchFormHasEnabled } = useContextAuth();

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
  }

  const deviceDrop = (item, monitor) => {

    const elementIndex = devices[`${item.id}`];

    if (!elementIndex) {
      addDevice({
        ...item,
        containerRef
      }, monitor)

      return;
    }

    repositionDevice({
      device: {
        ...item,
        containerRef
      },
      screen: monitor,
      flows,
      connectionLines,
      updateLines,
      updateFlow
    });
  }

  const [_, drop] = useDrop(() => ({
    accept: ['device', 'menu-device'],
    drop: (item, monitor) => deviceDrop(item, monitor),
  }), [devices, flows, connectionLines]);

  const handleMouseDown = (event) => {
    //Valid if the element to be dragged is the line container,
    //this way the scroll will only be moved when we drag the container
    const isLinesContainer = event.target.id.includes('lines');

    if (!isLinesContainer) return;

    const scrollElement = containerRef.current;
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

    const scrollElement = containerRef.current;

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
      setDevice({
        ...device,
        containerRef
      });
      await new Promise(resolve => setTimeout(resolve, 50))
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

      <LinesContainer ref={containerRef} />

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
