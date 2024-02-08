import { apiAuth } from '@/lib/axios';

export async function deleteAccount({ personType, personId }) {
  await apiAuth.delete(`/${personType}s/${personId}`);
}
