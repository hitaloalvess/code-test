import { shallow } from 'zustand/shallow';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getProjectsByAccountId,
  createProject,
  updateProject,
  deleteProject,
  getProjectById
} from '@/api/http';
import { useStore } from '@/store';
import { queryClient } from '@/lib/react-query';
import { useContextAuth } from '@/hooks/useAuth';

import { removeHTMLElementRef } from "@/utils/projects-functions";
import { formattedDate } from '../utils/date-functions';

export async function getProjects(personId) {

  const { projects } = await getProjectsByAccountId({ id: personId });

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

  const create = useMutation(
    async (data) => {

      const newProject = {
        ...data,
        personId: person.id,
        devices: [],
        flows: []
      }

      const { project } = await createProject(newProject);
      return project;
    },
    {
      onSuccess: () => {
        toast.success('Projeto criado com sucesso.');
        return queryClient.invalidateQueries('projects');
      },
    }
  )

  const update = useMutation(
    async (data) => {
      const newProject = { ...data }

      const { project } = await updateProject({
        projectId: data.id,
        data: newProject
      })
      return project;
    },
    {
      onSuccess: () => {
        toast.success('Projeto atualizado com sucesso.');
        return queryClient.invalidateQueries('projects')
      },
    }
  );

  const save = async (data) => {
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

    const { project } = await updateProject({
      projectId: data.id,
      data: newProject
    })
    return project;
  };

  const remove = useMutation(
    async (projectId) => {
      const { project } = await deleteProject({ projectId })
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

  const load = async (projectId) => {
    const { project } = await getProjectById({ projectId });

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
    createProject: create,
    updateProject: update,
    deleteProject: remove,
    loadProject: load,
    saveProject: save
  }
}

export const useQueryProject = (personId) => {
  return useQuery(['projects'], () => {
    return getProjects(personId);
  }, {
    staleTime: 1000 * 60 * 30, //10 minutes
  });

}
