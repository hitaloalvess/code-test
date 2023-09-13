import { v4 as uuid } from 'uuid';
import { useState } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import {
  removeHTMLElementRef,
  replaceFuncInString,
  replaceStringInFunc
} from "@/utils/projects-functions";
import { formattedDate } from '@/utils/date-functions';


export const useProject = () => {

  const [project, setProject] = useState();

  const {
    getFlows,
    getDevices,
    loadDevice,
    createFlow,
  } = useStore(store => ({
    getFlows: store.getFlows,
    getDevices: store.getDevices,
    loadDevice: store.loadDevice,
    createFlow: store.createFlow,
  }), shallow);

  const createProject = (objProject) => {

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
      created_at: new Date()
    }


    //Function to store data

    const existProjects = localStorage.getItem('@Microdigo:projects');
    const deserializedProjects = existProjects ?
      JSON.parse(existProjects, replaceStringInFunc) :
      [];

    const newProjectList = [...deserializedProjects, project]

    const serializedFlows = JSON.stringify(newProjectList, replaceFuncInString, 2);
    localStorage.setItem('@Microdigo:projects', serializedFlows);


    return project.id;
  }

  const getProjects = () => {
    const project = localStorage.getItem('@Microdigo:projects');

    if (!project) return [];

    const deserializedProjects = JSON.parse(project, replaceStringInFunc);

    const newProjects = deserializedProjects.map(project => {

      return {
        ...project,
        created_at: formattedDate(project.created_at)
      }
    });


    return newProjects;
  }

  const saveProject = () => {

    const projects = getProjects();

    const objProject = {
      ...project,
      devices: getDevices(),
      flows: getFlows()
    }

    // Apply transformation on devices and streams object to remove HTMLElements
    // HTML elements are not accepted when serializing to JSON.
    const transformDevices = Object.values(objProject.devices).map(device => {
      const newDevice = removeHTMLElementRef(device);

      return newDevice;
    });

    const transformFlows = Object.entries(objProject.flows).reduce((acc, value) => {
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

    const newProject = {
      ...objProject,
      devices: transformDevices,
      flows: transformFlows
    }

    const newProjectList = projects.map(project => {
      if (newProject.id === project.id) {
        return newProject;
      }

      return project;
    });

    const serializedFlows = JSON.stringify(newProjectList, replaceFuncInString, 2);
    localStorage.setItem('@Microdigo:projects', serializedFlows);
  }

  const deleteProject = (projectId) => {
    const projects = getProjects();

    const newProjectList = projects.filter(project => project.id !== projectId);

    const serializedFlows = JSON.stringify(newProjectList, replaceFuncInString, 2);
    localStorage.setItem('@Microdigo:projects', serializedFlows);
  }

  const updateProject = (objProject) => {
    const projects = getProjects();

    const newProjects = projects.map(project => {
      if (project.id === objProject.id) {
        return {
          ...project,
          name: objProject.name,
          description: objProject.description
        }
      }

      return project;
    })

    const serializedFlows = JSON.stringify(newProjects, replaceFuncInString, 2);
    localStorage.setItem('@Microdigo:projects', serializedFlows);
  }

  const loadProject = async (projectId) => {
    const projects = getProjects();
    const project = projects.find(project => project.id === projectId);

    const deviceList = Object.values(project.devices).map(async (device) => {
      loadDevice({ ...device });
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

    setProject(project);

  };

  return {
    project,
    createProject,
    getProjects,
    saveProject,
    deleteProject,
    updateProject,
    loadProject
  }
}
