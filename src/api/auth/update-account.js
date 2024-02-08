import { apiAuth } from '@/lib/axios';

export async function updateAccount({ personType, personId, data }) {
  const response = await apiAuth.put(`/${personType}s/${personId}`, data);

  return { data: response.data };
}
