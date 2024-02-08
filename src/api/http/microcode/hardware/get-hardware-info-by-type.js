import { apiMicrocode } from '@/lib/axios';

export async function getHardwareInfoByType({ hardwareType }) {
  const response = await apiMicrocode.get(`hardwares/${hardwareType}`);

  return { hardware: response.data.hardware }
}
