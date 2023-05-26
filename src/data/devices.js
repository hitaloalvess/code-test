//entry
import deviceLdr from '@/assets/images/devices/entry/ldr.svg';
import devicePotentiometer from '@/assets/images/devices/entry/potentiometer.svg';
import deviceSwitch from '@/assets/images/devices/entry/switchOff.svg';

//exit
import deviceLed from '@/assets/images/devices/exit/led.svg';
import deviceLedMono from '@/assets/images/devices/exit/ledMono.svg';
import deviceLaser from '@/assets/images/devices/exit/laser.svg';

//conditional
import deviceAnd from '@/assets/images/devices/conditional/and.svg';

//event
import devicePickColor from '@/assets/images/devices/event/pickcolor.svg';


export const mockDevices = {
  entry: [
    {
      id: 5,
      imgSrc: deviceLdr,
      name: 'ldr',
      type: 'virtual',
      category: 'entry'
    },
    {
      id: 8,
      imgSrc: devicePotentiometer,
      name: 'potentiometer',
      type: 'virtual',
      category: 'entry'
    },
    {
      id: 10,
      imgSrc: deviceSwitch,
      name: 'switch',
      type: 'virtual',
      category: 'entry'
    },
  ],
  exit: [
    {
      id: 6,
      imgSrc: deviceLed,
      name: 'led',
      type: 'virtual',
      category: 'exit'
    },
    {
      id: 7,
      imgSrc: deviceLedMono,
      name: 'ledMono',
      type: 'virtual',
      category: 'exit'
    },
    {
      id: 4,
      imgSrc: deviceLaser,
      name: 'laser',
      type: 'virtual',
      category: 'exit'
    },
  ],
  conditional: [
    {
      id: 12,
      imgSrc: deviceAnd,
      name: 'and',
      type: 'virtual',
      category: 'conditional'
    },
  ],
  event: [
    {
      id: 15,
      imgSrc: devicePickColor,
      name: 'pickColor',
      type: 'virtual',
      category: 'event'
    }
  ]
};

export const deviceConnectorRules = {
  potentiometer: {
    acceptedConnections: ['allExit'],
    connectsTo: ['all']
  },
  dht: {
    acceptedConnections: ['allExit'],
    connectsTo: ['all']
  },
  ldr: {
    acceptedConnections: ['allExit'],
    connectsTo: ['all']
  },
  pushButton: {
    acceptedConnections: ['allExit'],
    connectsTo: ['all']
  },
  switch: {
    acceptedConnections: ['allExit'],
    connectsTo: ['all']
  },
  infrared: {
    acceptedConnections: ['AllExit'],
    connectsTo: ['if']
  },
  led: {
    acceptedConnections: ['allEntry'],
    connectsFrom: ['all']
  },
  buzzer: {
    acceptedConnections: ['allEntry'],
    connectsFrom: ['potentiometer', 'ldr', 'pushButton', 'counter', 'and', 'or', 'not', 'if', 'toggle', 'slider', 'delay', 'switch', 'physicalPotentiometer', 'physicalLDR']
  },
  shakeMotor: {
    acceptedConnections: ['allEntry'],
    connectsFrom: ['potentiometer', 'ldr', 'pushButton', 'counter', 'and', 'or', 'not', 'if', 'toggle', 'slider', 'delay', 'switch', 'physicalPotentiometer', 'physicalLDR']
  },
  ledMono: {
    acceptedConnections: ['allEntry'],
    connectsFrom: ['all']
  },
  laser: {
    acceptedConnections: ['allEntry'],
    connectsFrom: ['all']
  },
  counter: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['potentiometer', 'ldr', 'pushButton', 'slider', 'delay', 'toggle', 'and', 'or', 'physicalPotentiometer', 'physicalLDR'],
    connectsTo: ['all']
  },
  and: {
    acceptedConnections: ['allEntry', 'oneExit'],
    connectsFrom: ['all'],
    connectsTo: ['all']
  },
  or: {
    acceptedConnections: ['allEntry', 'oneExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  not: {
    acceptedConnections: ['oneEntry', 'oneExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  if: {
    acceptedConnections: ['oneEntry', 'oneExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  toggle: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  delay: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  pickColor: {
    acceptedConnections: ['allEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['led', 'physicalLED'],
  },
  slider: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['potentiometer', 'ldr', 'counter', 'slider', 'physicalPotentiometer', 'physicalLDR', 'physicalDHT'],
    connectsTo: ['all'],
  },
}
