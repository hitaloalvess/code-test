import { useMutation, useQuery } from '@tanstack/react-query';
import { shallow } from 'zustand/shallow';

import { removeHTMLElementRef } from "@/utils/projects-functions";
import { useStore } from '@/store';
import { apiMicroCode } from '@/services/apiMicroCode';
import { queryClient } from '@/services/queryClient';
import { formattedDate } from '../utils/date-functions';



export async function getProjects(userCpf) {
  const projects = await apiMicroCode.get(`/projects/user/${userCpf}`);

  const transformProjects = projects.data.map(project => {
    return {
      ...project,
      createdAt: formattedDate(project.createdAt)
    }
  });

  return transformProjects;
}

export const useProject = () => {

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

  const createProject = useMutation(
    async (newProject) => {
      const response = await apiMicroCode.post(`/projects`, newProject);

      return response.data;
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries('projects');
      },
    }
  )

  const updateProject = useMutation(
    async (newProject) => {
      const response = await apiMicroCode.put(`/projects/${newProject.id}`, newProject);

      return response.data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries('projects'),
    }
  );

  const deleteProject = useMutation(
    async (projectId) => {
      const response = await apiMicroCode.delete(`/projects/${projectId}`);

      return response.data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries('projects'),
    }
  );

  const loadProject = async (projectId) => {
    const { data: project } = await apiMicroCode.get(`/projects/${projectId}`);

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
    });


  };


  const saveProject = async (projectId) => {
    let newProject = {
      id: projectId,
      devices: getDevices(),
      flows: getFlows(),
    }

    // Apply transformation on devices and streams object to remove HTMLElements
    // HTML elements are not accepted when serializing to JSON.
    const transformDevices = Object.values(newProject.devices).map(device => {
      const newDevice = removeHTMLElementRef(device);

      return newDevice;
    });

    const transformFlows = Object.entries(newProject.flows).reduce((acc, value) => {
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

      return [
        ...acc,
        {
          ...objValue,
          connections
        }
      ]
    }, []);

    newProject = {
      ...newProject,
      devices: transformDevices,
      flows: transformFlows
    }

    await updateProject.mutateAsync(newProject);
  }


  return {
    createProject,
    updateProject,
    deleteProject,
    loadProject,
    saveProject
  }
}

export const useQueryProject = (userCpf) => {
  return useQuery(['projects'], () => {
    return getProjects(userCpf);
  }, {
    staleTime: 1000 * 60 * 30, //10 minutes
    // initialData: projects
  });

}
