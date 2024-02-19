import { socket } from '@/lib/websocket';

export function updateHardware({ mac, userId, data }) {
  socket.emit('hardware/update', { mac, userId, data });
}
