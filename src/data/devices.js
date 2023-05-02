//entry
import deviceLdr from '@/assets/images/devices/entry/ldr.svg';

//exit
import deviceLed from '@/assets/images/devices/exit/led.svg';

//conditional
import deviceAnd from '@/assets/images/devices/conditional/and.svg';

//event 
import devicePickColor from '@/assets/images/devices/event/pickcolor.svg';


export const mockDevices = {
    entry: [
        {
            id: 1,
            imgSrc: deviceLdr,
            name: 'ldr',
            type: 'virtual',
            category: 'entry'
        },
    ],
    exit: [
        {
            id: 2,
            imgSrc: deviceLed,
            name: 'led',
            type: 'virtual',
            category: 'exit'
        },
    ],
    conditional: [
        {
            id: 3,
            imgSrc: deviceAnd,
            name: 'and',
            type: 'virtual',
            category: 'conditional'
        },
    ],
    event: [
        {
            id: 4,
            imgSrc: devicePickColor,
            name: 'pickColor',
            type: 'virtual',
            category: 'event'
        }
    ]
};