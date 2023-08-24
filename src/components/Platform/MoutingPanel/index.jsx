/* eslint-disable no-unused-vars */
import { useRef, useState, forwardRef /*, useEffect */ } from 'react';
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


const MoutingPanel = forwardRef(function MoutingPanel(props, ref) {
  // const isFirstRender = useRef(true);

  const { devices, addDevice, repositionDevice, handleSetDevice } = useDevices();
  const { flows, connectionLines, updateLines, updateFlow, handleSetLine, handleSetFlows, createFlow } = useFlow();
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

  //SOMENTE TESTES

  const handleLoadDevices = async (devicesTest) => {

    const deviceList = Object.values(devicesTest).map(async (device) => {
      handleSetDevice({
        ...device,
        containerRef: ref
      });
      await new Promise(resolve => setTimeout(resolve, 10))
    });


    await Promise.all(deviceList);

    return;

  }

  const handleLoadFlows = (flows) => {

    Object.values(flows).forEach(flow => {
      flow.connections.forEach(connection => {
        createFlow({
          devices: {
            from: connection.deviceFrom,
            to: connection.deviceTo
          }
        })
      })
    })
  }


  const replaceFuncInString = (key, value) => {
    if (typeof value === 'function') {
      return { _isFunction: true, body: value.toString() }; //Convert func for string
    }

    return value;
  }

  const replaceStringInFunc = (key, value) => {
    if (value && typeof value === 'object' && value._isFunction && value.body) {
      return new Function(`return ${value.body}`)();
    }

    return value;
  }

  const handleSaveProject = () => {

    const newDevices = Object.values(devices).map(device => {
      if (Object.hasOwn(device, 'containerRef')) {
        delete device.containerRef;
      }

      if (Object.hasOwn(device, 'defaultBehavior')) {
        delete device.defaultBehavior;
      }

      if (Object.hasOwn(device, 'redefineBehavior')) {
        delete device.redefineBehavior;
      }

      return device;
    });

    const newFlows = Object.values(flows).map(flow => {
      const connections = flow.connections.map(connection => {
        if (Object.hasOwn(connection.deviceFrom, 'containerRef')) {
          delete connection.deviceFrom.containerRef
        }

        if (Object.hasOwn(connection.deviceTo, 'containerRef')) {
          delete connection.deviceTo.containerRef
        }

        return connection;
      })

      return {
        ...flow,
        connections
      }
    })

    const objFlow = newFlows.reduce((acc, flow) => {
      return {
        ...acc, [`${flow.id}`]: flow
      }
    }, {});

    const project = {
      id: 'asdasdas',
      userId: 'laksdjasldkas',
      flows: objFlow,
      devices: newDevices,
    }


    const serializedFlows = JSON.stringify(project, replaceFuncInString, 2);

    localStorage.setItem('@Microdigo:project', serializedFlows);


  }

  const handleGetProject = async () => {
    const project = localStorage.getItem('@Microdigo:project');

    const deserializedFlows = JSON.parse(project, replaceStringInFunc);

    await handleLoadDevices(deserializedFlows.devices);
    handleLoadFlows(deserializedFlows.flows);
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
          onClick={handleSaveProject}
        >Save</button>
        <button
          onClick={handleGetProject}
        >Load</button>
      </div>

    </div>
  );
})

export default MoutingPanel;
