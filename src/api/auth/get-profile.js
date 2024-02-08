import { apiAuth } from '@/lib/axios';

export async function getProfile() {
  const response = await apiAuth.get('/me');

  return { person: response.data.person };
}
