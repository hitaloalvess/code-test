/* eslint-disable no-unused-vars */
import {
  useRef, useState, forwardRef, /*, useEffect */
  useEffect
} from 'react';
import { useDrop } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import { useContextAuth } from '@/hooks/useAuth';

import Device from '@/components/Platform/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';
import ManualButton from './CircleButton/ManualButton';
import ZoomButton from './CircleButton/ZoomButton';
import FaqButton from './CircleButton/FaqButton';
import SearchFormButton from './CircleButton/SearchFormButton';

import { moutingPanelContainer, buttonsContainer } from './styles.module.css';
import { useProject } from '@/hooks/useProject';


const MoutingPanel = forwardRef(function MoutingPanel(props, ref) {

  const { saveProject } = useProject();
  const { devices, addDevice, repositionDevice } = useDevices();
  const { flows, connectionLines, updateLines, updateFlow } = useFlow();
  const { searchFormHasEnabled } = useContextAuth();

  const moutingPanelRef = useRef(null);

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
        containerRef: ref
      }, monitor)

      return;
    }

    repositionDevice({
      device: {
        ...item,
        containerRef: ref
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

    const scrollElement = ref.current;
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

    const scrollElement = ref.current;

    const { clientX, clientY } = event;

    const distanceX = clientX - posX;
    const distanceY = clientY - posY;

    scrollElement.scrollTop = posTop - distanceY;
    scrollElement.scrollLeft = posLeft - distanceX;

    moutingPanelRef.current.style.cursor = 'grabbing';

  }


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

      <LinesContainer ref={ref} />

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
            saveProject({
              name: 'Projeto 1',
              userId: '232131',
              description: 'Projeto 1 - teste para criacao da funcionalidade',
              devices,
              flows
            })
          }}
        >Save</button>
        {/* <button
          onClick={getProject}
        >Load</button> */}
      </div>

    </div>
  );
})

export default MoutingPanel;
