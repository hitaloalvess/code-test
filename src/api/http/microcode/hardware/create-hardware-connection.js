import { apiMicrocode } from '@/lib/axios';

export async function createHardwareConnection({ mac, userId }) {
  const response = await apiMicrocode.post('hardware/connect', {
    mac, userId
  });

  return { hardware: response.data.hardware }

}
