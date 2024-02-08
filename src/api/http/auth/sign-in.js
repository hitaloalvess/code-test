import { apiAuth } from '@/lib/axios';

export async function signIn({ email, password }) {
  const response = await apiAuth.post('/sessions', {
    email, password
  });

  return { token: response.data.token }
}
