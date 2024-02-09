import { socket } from '@/lib/websocket';

/*
  You must send it to the mac, along with the events object optionally containing the fields dashboard,isFirstUseInterval, proofLife, standby
  {
    mac: string,
    events: { dashboard?:boolean, isFirstUseInterval?: boolean, proofLife?:boolean, standby?:boolean }
  }
*/
export async function updateHardwareEvents({ mac, userId ,events }){
  socket.emit('hardware/update/events', { mac, userId, events });
}
