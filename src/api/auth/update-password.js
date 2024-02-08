import { apiAuth } from '@/lib/axios';

export async function updatePassword({ currentPassword, newPassword }) {
  await apiAuth.patch('/credentials/password', {
    currentPassword, newPassword
  });
}
