/* eslint-disable no-unused-vars */
import { useRef, useState, forwardRef /*, useEffect */ } from 'react';
import { useDrop } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import Device from '@/components/Platform/Device/index';
import BackgroundGrade from './BackgroundGrade';
import LinesContainer from './LinesContainer';
import ManualButton from './ManualButton';
import ZoomButton from './ZoomButton';
import FaqButton from './FaqButton';

import { moutingPanelContainer, buttonsContainer } from './styles.module.css';
import SearchFormButton from './SearchFormButton';
import { useContextAuth } from '@/hooks/useAuth';


const MoutingPanel = forwardRef(function MoutingPanel(props, ref) {
  // const isFirstRender = useRef(true);

  const { devices, addDevice, repositionDevice, handleSetDevice } = useDevices();
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

  //SOMENTE TESTES

  const handleLoadDevices = (devicesTest) => {
    // const devicesTest = [{
    //   category: "entry",
    //   id: "ed83557e-274e-4f30-949a-90d72d5d3b86",
    //   imgSrc: "/src/assets/images/devices/entry/potentiometer.svg",
    //   name: "potentiometer",
    //   posX: 494.3999938964844,
    //   posY: 328.40000915527344,
    //   type: "virtual",
    //   value: { current: 0, max: 1023 }
    // },
    // {

    //   id: "5d1a3dc4-6910-444d-9251-527b6a8ec418",
    //   imgSrc: "/src/assets/images/devices/exit/led.svg",
    //   name: "led",
    //   type: "virtual",
    //   category: "exit",
    //   value: {
    //     active: false,
    //     current: 0,
    //     max: 0,
    //     type: null,
    //     color: "#ff1450",
    //     opacity: 0,
    //     brightness: 1023

    //   },
    //   posX: 893.3999938964844,
    //   posY: 315.3999938964844

    // }
    // ];

    devicesTest.forEach(device => {
      handleSetDevice({
        ...device,
        containerRef: ref
      });
    })

  }

  // const handleLoadFlows = () => {
  //   const flows = {
  //     "530b41b7-bcb1-48c2-ad7d-86ec41595ca9": {
  //       "id": "530b41b7-bcb1-48c2-ad7d-86ec41595ca9",
  //       "connections": [
  //         {
  //           "id": "3d4442d3-799c-4809-b379-8ed14570c50a",
  //           "deviceFrom": {
  //             "id": "a5850819-2c71-4a48-9b70-20597c2dfb33",
  //             "imgSrc": "/src/assets/images/devices/entry/potentiometer.svg",
  //             "name": "potentiometer",
  //             "type": "virtual",
  //             "category": "entry",
  //             "value": {
  //               "current": 0,
  //               "max": 1023
  //             },
  //             "posX": 341.3999938964844,
  //             "posY": 329.40000915527344,
  //             "defaultBehavior": "getResistance() {}",
  //             "connector": {
  //               "x": 447.390625,
  //               "y": 354.390625,
  //               "id": "resistance-7ea26e1e-3350-4711-97b4-250379bb83cd",
  //               "name": "resistance",
  //               "type": "exit"
  //             }
  //           },
  //           "deviceTo": {
  //             "id": "00c00da9-b58b-4f64-9f42-76ad6148d385",
  //             "imgSrc": "/src/assets/images/devices/exit/led.svg",
  //             "name": "led",
  //             "type": "virtual",
  //             "category": "exit",
  //             "value": {
  //               "active": false,
  //               "current": 0,
  //               "max": 0,
  //               "type": null,
  //               "color": "#ff1450",
  //               "opacity": 0,
  //               "brightness": 1023
  //             },
  //             "posX": 719.3999938964844,
  //             "posY": 319.3999938964844,
  //             "defaultBehavior": "defaultBehavior() {}",
  //             "redefineBehavior": "redefineBehavior() {}",
  //             "connector": {
  //               "x": 693.390625,
  //               "y": 344.390625,
  //               "id": "brightness-15d38aec-2af0-4bfb-8821-7c0c15193c75",
  //               "name": "brightness",
  //               "type": "entry"
  //             }
  //           },
  //           "idLine": "f6019725-8f07-4c2e-afa1-cff8ad557937"
  //         }
  //       ]
  //     }
  //   }

  //   Object.values(flows).forEach(flow => {
  //     flow.connections.forEach(connection => {
  //       console.log({ connection })
  //       createFlow({
  //         devices: {
  //           from: connection.deviceFrom,
  //           to: connection.deviceTo
  //         }
  //       })
  //     })
  //   })
  // }

  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;

  //     return;
  //   }

  //   handleLoadDevices();

  //   // handleLoadFlows();
  // }, []);

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

    const newDevices = devices.map(device => {
      if (Object.hasOwn(device, 'containerRef')) {
        delete device.containerRef;
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
      devices: newDevices
    }

    const serializedFlows = JSON.stringify(project, replaceFuncInString, 2);


    localStorage.setItem('@Microdigo:project', serializedFlows);

    // console.log(serializedFlows);

  }

  const handleGetProject = () => {
    const project = localStorage.getItem('@Microdigo:project');

    const deserializedFlows = JSON.parse(project, replaceStringInFunc);

    handleLoadDevices(deserializedFlows.devices);

    // const getValueFrom = deserializedFlows.flows['f0686513-f7d4-47cb-9e76-a3a8f5901909'].connections[0].deviceFrom.defaultBehavior();

    // console.log({
    //   getValueFrom
    // })
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
