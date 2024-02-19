import { socket } from '@/lib/websocket';

export function clearHardware({ mac, userId }) {
  socket.emit('hardware/clear', { mac, userId });
}
