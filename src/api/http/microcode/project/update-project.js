import { apiMicrocode } from '@/lib/axios';

export async function updateProject({ projectId, data }) {
  const response = await apiMicrocode.put(`/projects/${projectId}`, data);

  return { project: response.data.project }
}
