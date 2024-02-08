import { apiMicrocode } from '@/lib/axios';

export async function getProjectById({ projectId }) {
  const response = await apiMicrocode.get(`/projects/${projectId}`);

  return { project: response.data.project };
}
