import { socket } from '@/lib/websocket';

export function clearHardware({ mac, userId }) {
  console.log({
    title: 'Executando clear hardware',
    mac, userId
  })
  socket.emit('hardware/clear', { mac, userId });
}
