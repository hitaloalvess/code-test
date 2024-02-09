import { socket } from '@/lib/websocket';

export async function disconnectHardware({ mac, userId }){
  socket.emit('hardware/disconnect', { mac, userId });
}
