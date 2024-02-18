import { socket } from '@/lib/websocket';

export function disconnectHardware({ mac, userId }) {
  socket.emit('hardware/disconnect', { mac, userId });
}
