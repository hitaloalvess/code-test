import { useMutation, useQuery } from '@tanstack/react-query';
import { shallow } from 'zustand/shallow';

import { removeHTMLElementRef } from "@/utils/projects-functions";
import { useStore } from '@/store';
import { apiMicrocode } from '@/services/apiMicrocode';
import { queryClient } from '@/services/queryClient';
import { formattedDate } from '../utils/date-functions';
import { useContextAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

export async function getProjects(personId) {

  const { data: { projects } } = await apiMicrocode.get(`/projects/user/${personId}`);

  const transformProjects = projects.map(project => {
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
        personId: person.id,
        devices: [],
        flows: []
      }

      const { data: { project } } = await apiMicrocode.post(`/projects`, newProject);

      return project;
    },
    {
      onSuccess: () => {
        toast.success('Projeto criado com sucesso.');
        return queryClient.invalidateQueries('projects');
      },
    }
  )

  const updateProject = useMutation(
    async (data) => {
      const newProject = { ...data }

      const { data: { project } } = await apiMicrocode.put(`/projects/${data.id}`, newProject);

      return project;
    },
    {
      onSuccess: () => {
        toast.success('Projeto atualizado com sucesso.');
        return queryClient.invalidateQueries('projects')
      },
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

    const response = await apiMicrocode.put(`/projects/${data.id}`, newProject);

    return response.data;
  };

  const deleteProject = useMutation(
    async (projectId) => {
      const { data: { project } } = await apiMicrocode.delete(`/projects/${projectId}`);

      return project;
    },
    {
      onSuccess: () => {
        toast.success('Projeto deletado com sucesso.');
        return queryClient.invalidateQueries('projects');
      },
      onError: (error) => toast.error(error.message)
    }
  );

  const loadProject = async (projectId) => {
    const { data: { project } } = await apiMicrocode.get(`/projects/${projectId}`);

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

export const useQueryProject = (personId) => {
  return useQuery(['projects'], () => {
    return getProjects(personId);
  }, {
    staleTime: 1000 * 60 * 30, //10 minutes
  });

}
