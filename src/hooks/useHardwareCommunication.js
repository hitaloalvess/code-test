import { apiMicrocode } from '@/services/api-microcode';
import { HardwareCommunicationHttpRoutes } from '../constants/hardware-communication';

export const useHardwareCommunication = () => {

  const connectHardware = async ({ mac, userId }) => {
    const { data } = await apiMicrocode.post(HardwareCommunicationHttpRoutes.CONNECT, {
      mac, userId
    })

    return data;
  }

  return {
    connectHardware
  }
}
