import { apiMicrocode } from '@/services/api-microcode';
import { MicrocodeHttpRoutes } from '../constants/hardware-communication';

export const useHardwareCommunication = () => {

  const connectHardware = async ({ mac, userId }) => {
    const { data } = await apiMicrocode.post(MicrocodeHttpRoutes.HARDWARE_CONNECT, {
      mac, userId
    })

    return data;
  }

  return {
    connectHardware
  }
}
