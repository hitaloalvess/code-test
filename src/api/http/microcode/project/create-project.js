import { apiMicrocode } from '@/lib/axios';

export async function createProject({
  name,
  description,
  personId,
  devices,
  flows,
}) {
  const response = await apiMicrocode.post(`/projects`, {
    name,
    description,
    personId,
    devices,
    flows,
  });

  return { project: response.data.project }
}
