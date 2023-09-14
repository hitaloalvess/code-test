//entry
import deviceLdr from '@/assets/images/devices/entry/ldr.svg';
import devicePotentiometer from '@/assets/images/devices/entry/potentiometer.svg';
import deviceSwitch from '@/assets/images/devices/entry/switchOff.svg';
import devicePushButton from '@/assets/images/devices/entry/pushButtonOff.svg';
import deviceDht from '@/assets/images/devices/entry/dht.svg';
import deviceInfrared from '@/assets/images/devices/entry/infrared.svg';
import deviceSoilMoisture from '@/assets/images/devices/event/eventBase.svg';
import deviceRainDetector from '@/assets/images/devices/event/eventBase.svg';

//exit
import deviceLed from '@/assets/images/devices/exit/led.svg';
import deviceLedMono from '@/assets/images/devices/exit/ledMono.svg';
import deviceLaser from '@/assets/images/devices/exit/laser.svg';
import deviceShakeMotor from '@/assets/images/devices/exit/shakeMotor.svg';
import deviceBuzzer from '@/assets/images/devices/exit/buzzer.svg';
import deviceBargraph from '@/assets/images/devices/event/eventBase.svg';
import deviceTimer from '@/assets/images/devices/event/eventBase.svg';


//conditional
import deviceAnd from '@/assets/images/devices/conditional/and.svg';
import deviceOr from '@/assets/images/devices/conditional/or.svg';
import deviceNot from '@/assets/images/devices/conditional/not.svg';
import deviceIf from '@/assets/images/devices/conditional/if.svg';
import deviceCounter from '@/assets/images/devices/conditional/counter/counter.svg';

//event
import devicePickColor from '@/assets/images/devices/event/pickcolor.svg';
import deviceToggle from '@/assets/images/devices/event/toggle.svg';
import deviceDelay from '@/assets/images/devices/event/delay.svg';
import deviceSlider from '@/assets/images/devices/event/slider.svg';
import deviceLoop from '@/assets/images/devices/event/loop.svg';

export const mockDevices = {
  entry: [
    {
      id: 10,
      imgSrc: deviceDht,
      name: 'dht',
      type: 'virtual',
      category: 'entry',
      value: {
        current: 0,
        max: 1023
      },
    },
    {
      id: 11,
      imgSrc: deviceInfrared,
      name: 'infrared',
      type: 'virtual',
      category: 'entry',
      value: 'FF12F3'
    },
    {
      id: 12,
      imgSrc: deviceLdr,
      name: 'ldr',
      type: 'virtual',
      category: 'entry',
      value: {
        current: 0,
        max: 1023
      }
    },
    {
      id: 13,
      imgSrc: devicePotentiometer,
      name: 'potentiometer',
      type: 'virtual',
      category: 'entry',
      value: {
        current: 0,
        max: 1023
      }
    },
    {
      id: 14,
      imgSrc: devicePushButton,
      name: 'pushButton',
      type: 'virtual',
      category: 'entry',
      value: false
    },
    {
      id: 15,
      imgSrc: deviceSwitch,
      name: 'switch',
      type: 'virtual',
      category: 'entry',
      value: false
    },
    {
      id: 16,
      imgSrc: deviceRainDetector,
      name: 'rainDetector',
      type: 'virtual',
      category: 'entry',
      value: {
        current: 0,
        max: 1023
      },
    },
    {
      id: 17,
      imgSrc: deviceSoilMoisture,
      name: 'soilMoisture',
      type: 'virtual',
      category: 'entry',
      value: {
        current: 0,
        max: 1023
      },
    }
  ],
  exit: [
    {
      id: 20,
      imgSrc: deviceLed,
      name: 'led',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        color: '#ff1450',
        opacity: 0,
        brightness: 1023
      }
    },
    {
      id: 21,
      imgSrc: deviceLedMono,
      name: 'ledMono',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        opacity: 0,
        brightness: 1023
      }
    },
    {
      id: 22,
      imgSrc: deviceLaser,
      name: 'laser',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        opacity: 0,
        brightness: 1023
      }
    },
    {
      id: 23,
      imgSrc: deviceShakeMotor,
      name: 'shakeMotor',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null
      }
    },
    {
      id: 24,
      imgSrc: deviceBuzzer,
      name: 'buzzer',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        duration: 4,
        volume: 0.5,
      }
    },
    {
      id: 25,
      imgSrc: deviceBargraph,
      name: 'bargraph',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        opacity: 0,
        brightness: 1023
      }
    },
    {
      id: 26,
      imgSrc: deviceTimer,
      name: 'timer',
      type: 'virtual',
      category: 'event',
      value: {
        current: 0,
        max: 0
      }
    },
  ],
  event: [
    {
      id: 30,
      imgSrc: devicePickColor,
      name: 'pickColor',
      type: 'virtual',
      category: 'event',
      value: {
        current: 0,
        max: 0,
        color: '#39394E'
      }
    },
    {
      id: 31,
      imgSrc: deviceToggle,
      name: 'toggle',
      type: 'virtual',
      category: 'event',
      value: false
    },
    {
      id: 32,
      imgSrc: deviceDelay,
      name: 'delay',
      type: 'virtual',
      category: 'event',
      value: {
        current: 0,
        max: 0
      }
    },
    {
      id: 33,
      imgSrc: deviceSlider,
      name: 'slider',
      type: 'virtual',
      category: 'event',
      value: {
        current: 0,
        max: 0
      }
    },
    {
      id: 34,
      imgSrc: deviceLoop,
      name: 'loop',
      type: 'virtual',
      category: 'event',
      value: {
        current: 0,
        max: 0
      }
    }
  ],
  conditional: [
    {
      id: 40,
      imgSrc: deviceAnd,
      name: 'and',
      type: 'virtual',
      category: 'conditional',
      value: false
    },
    {
      id: 41,
      imgSrc: deviceOr,
      name: 'or',
      type: 'virtual',
      category: 'conditional',
      value: false
    },
    {
      id: 42,
      imgSrc: deviceNot,
      name: 'not',
      type: 'virtual',
      category: 'conditional',
      value: false
    },
    {
      id: 43,
      imgSrc: deviceIf,
      name: 'if',
      type: 'virtual',
      category: 'conditional',
      value: false
    },
    {
      id: 44,
      imgSrc: deviceCounter,
      name: 'counter',
      type: 'virtual',
      category: 'conditional',
      value: {
        current: 0,
        max: 0
      }
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
  soilMoisture: {
    acceptedConnections: ['allExit'],
    connectsTo: ['all']
  },
  rainDetector: {
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
  bargraph: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['potentiometer', 'dht', 'ldr', 'counter', 'slider', 'physicalPotentiometer', 'physicalLDR', 'physicalDHT'],
  },
  counter: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['potentiometer', 'ldr', 'loop', 'pushButton', 'slider', 'delay', 'toggle', 'and', 'or', 'physicalPotentiometer', 'physicalLDR'],
    connectsTo: ['all']
  },
  and: {
    acceptedConnections: ['allEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all']
  },
  or: {
    acceptedConnections: ['allEntry', 'oneExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  not: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  if: {
    acceptedConnections: ['oneEntry', 'allExit'],
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
  timer: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  loop: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  pickColor: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['led', 'physicalLED'],
  },
  slider: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['potentiometer', 'dht', 'ldr', 'counter', 'slider', 'physicalPotentiometer', 'physicalLDR', 'physicalDHT'],
    connectsTo: ['all'],
  },
}
