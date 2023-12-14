import { useMutation, useQuery } from '@tanstack/react-query';
import { shallow } from 'zustand/shallow';

import { removeHTMLElementRef } from "@/utils/projects-functions";
import { useStore } from '@/store';
import { apiMicroCode } from '@/services/apiMicroCode';
import { queryClient } from '@/services/queryClient';
import { formattedDate } from '../utils/date-functions';
import { useContextAuth } from '@/hooks/useAuth';

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

  const { person } = useContextAuth();
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
    async (data) => {

      const newProject = {
        ...data,
        user: {
          email: person.email,
          name: person.name,
          document: person?.user ? person.user.cpf : person.user?.ra
        },
        devices: [],
        flows: []
      }

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
    async (data) => {
      const newProject = { ...data }

      const response = await apiMicroCode.put(`/projects/${data.id}`, newProject);

      return response.data;
    },
    {
      onSuccess: () => queryClient.invalidateQueries('projects'),
    }
  );

  const saveProject = async (data) => {
    let newProject = {
      ...data,
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

    const response = await apiMicroCode.put(`/projects/${data.id}`, newProject);

    return response.data;
  };

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
      await new Promise(resolve => setTimeout(resolve, 250))
    });


    await Promise.all(deviceList);


    const devices = getDevices();


    Object.values(project.flows).forEach(flow => {
      flow.connections.forEach(({ deviceFrom, deviceTo }) => {

        const from = {
          ...devices[deviceFrom.id],
          connector: {
            ...devices[deviceFrom.id].connectors[deviceFrom.connector.name]
          }
        }

        const to = {
          ...devices[deviceTo.id],
          connector: {
            ...devices[deviceTo.id].connectors[deviceTo.connector.name]
          }
        }

        delete from.connectors;
        delete to.connectors;

        createFlow({
          devices: {
            from,
            to
          }
        })
      })
    });


  };

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
  });

}
