import { socket } from '@/lib/websocket';

export function eventUnsubscribe(eventName){
  socket.removeListener(eventName);
}
