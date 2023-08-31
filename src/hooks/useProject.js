import { v4 as uuid } from 'uuid';

// import { useDevices } from '@/hooks/useDevices';
// import { useFlow } from '@/hooks/useFlow';

import {
  removeHTMLElementRef,
  replaceFuncInString,
  replaceStringInFunc
} from "@/utils/projects-function";


export const useProject = () => {

  // const { handleSetDevice } = useDevices();
  // const { createFlow } = useFlow();

  // const loadDevices = async (devicesTest) => {

  //   const deviceList = Object.values(devicesTest).map(async (device) => {
  //     handleSetDevice({
  //       ...device,
  //       // containerRef: ref
  //     });
  //     await new Promise(resolve => setTimeout(resolve, 10))
  //   });


  //   await Promise.all(deviceList);

  //   return;

  // }

  // const loadFlows = (flows) => {

  //   Object.values(flows).forEach(flow => {
  //     flow.connections.forEach(connection => {
  //       createFlow({
  //         devices: {
  //           from: connection.deviceFrom,
  //           to: connection.deviceTo
  //         }
  //       })
  //     })
  //   })
  // }


  const saveProject = (objProject) => {

    const { userId, name, description, devices, flows } = objProject;

    // Apply transformation on devices and streams object to remove HTMLElements
    // HTML elements are not accepted when serializing to JSON.

    const transformDevices = Object.values(devices).map(device => {
      const newDevice = removeHTMLElementRef(device);

      return newDevice;
    });

    const transformFlows = Object.entries(flows).reduce((acc, value) => {
      const key = value[0];
      const objValue = value[1];

      const connections = objValue.connections.map(connection => {

        const newDeviceFrom = removeHTMLElementRef(connection.deviceFrom);
        const newDeviceTo = removeHTMLElementRef(connection.deviceTo);

        return {
          ...connection,
          deviceFrom: newDeviceFrom,
          deviceTo: newDeviceTo
        };
      });

      return {
        ...acc,
        [key]: {
          ...objValue,
          connections
        }
      }
    }, {});


    const project = {
      id: uuid(),
      name,
      userId,
      description,
      flows: transformFlows,
      devices: transformDevices,
    }


    //Function to store data

    const existProjects = localStorage.getItem('@Microdigo:projects');
    const deserializedProjects = existProjects ?
      JSON.parse(existProjects, replaceStringInFunc) :
      [];

    const newProjectList = [...deserializedProjects, project]

    const serializedFlows = JSON.stringify(newProjectList, replaceFuncInString, 2);
    localStorage.setItem('@Microdigo:projects', serializedFlows);

  }

  const getProjects = async () => {
    const project = localStorage.getItem('@Microdigo:projects');

    if (!project) return;

    const deserializedFlows = JSON.parse(project, replaceStringInFunc);

    return deserializedFlows;
  }

  // const loadProject = async (id) => {
  //   await loadDevices(deserializedFlows.devices);
  //   loadFlows(deserializedFlows.flows);
  // }

  return {
    saveProject,
    getProjects,
    // loadProject
  }
}
