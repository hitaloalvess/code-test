import { apiMicrocode } from '@/lib/axios';

export async function createHardwareConnection({ mac, userId }) {
  const response = await apiMicrocode.post('hardwares/connect', {
    mac, userId
  });

  return { hardware: response.data.hardware }

}
