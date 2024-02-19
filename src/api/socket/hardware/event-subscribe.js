import { socket } from '@/lib/websocket';

export function eventSubscribe(eventName, listenerFn){
  socket.on(eventName, listenerFn);
}
