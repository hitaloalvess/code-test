import { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';
import ManualButton from '@/components/ManualButton';
import ZoomButton from '@/components/ZoomButton';
import FaqButton from '@/components/FaqButton';

import { moutingPanelContainer, buttonsContainer } from './styles.module.css';
import Dropzone from './Dropzone';

const MoutingPanel = () => {
  const { devices, addDevice, repositionDevice } = useDevices();
  const { flows, connectionLines, updateLines, updateFlow } = useFlow();

  const moutingPanelRef = useRef(null);
  const dropzoneRef = useRef(null);

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
    const elementIndex = devices.find(device => device.id === item.id);

    if (!elementIndex) {
      addDevice(item, monitor)

      return;
    }

    repositionDevice({
      device: { ...item },
      screen: monitor,
      flows,
      connectionLines,
      updateLines,
      updateFlow
    });
  }

  // eslint-disable-next-line no-unused-vars
  const [_, drop] = useDrop(() => ({
    accept: ['device', 'menu-device'],
    drop: (item, monitor) => deviceDrop(item, monitor),
  }), [devices, flows, connectionLines]);

  const handleMouseDown = (event) => {
    console.log(event.target);

    console.log(moutingPanelRef.current);

    // const { left, } = moutingPanelRef.current.getBoundingClientRect();

    console.log(moutingPanelRef.current.scrollLeft)
    // setChangingScrollPos({
    //   moving: true,

    // })
    moutingPanelRef.current.scrollLeft += 100
  }

  const handleMouseUp = () => {
    setChangingScrollPos({
      moving: false,
      posX: 0,
      posY: 0,
      posTop: 0,
      posLeft: 0
    });

    moutingPanelRef.current.cursor = 'grab';
  }

  const handleMouseMove = (event) => {
    const { posX, posY, posLeft, posTop, moving } = changingScrollPos;

    if (!moving) return;

    const { clientX, clientY } = event;

    const distanceX = clientX - posX;
    const distanceY = clientY - posY;

    moutingPanelRef.current.scrollTop = posTop - distanceY;
    moutingPanelRef.current.scrolLeft = posLeft - distanceX;
  }

  return (
    <div
      className={moutingPanelContainer}
      ref={attachRef}
      onMouseDown={handleMouseDown}
    // onMouseUp={handleMouseUp}
    // onMouseMove={handleMouseMove}
    >

      <Dropzone ref={dropzoneRef} />

      <LinesContainer />

      <BackgroundGrade
        dropzoneRef={dropzoneRef}
      />


      <div className={buttonsContainer}>
        <ManualButton />
        <FaqButton />
        <ZoomButton />
      </div>

    </div>
  );
};

export default MoutingPanel;
