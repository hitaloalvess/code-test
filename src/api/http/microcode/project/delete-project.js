import { apiMicrocode } from '@/lib/axios';

export async function deleteProject({ projectId }) {
  const response = await apiMicrocode.delete(`/projects/${projectId}`);

  return { project: response.data.project };
}
