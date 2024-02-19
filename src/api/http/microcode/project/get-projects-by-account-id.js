import { apiMicrocode } from '@/lib/axios';

export async function getProjectsByAccountId({ id }) {
  const response = await apiMicrocode.get(`/projects/user/${id}`);

  return { projects: response.data.projects }
}
