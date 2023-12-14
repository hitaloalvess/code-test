//entry
import deviceLdr from '@/assets/images/devices/entry/ldr.svg';
import devicePotentiometer from '@/assets/images/devices/entry/potentiometer.svg';
import deviceSwitch from '@/assets/images/devices/entry/switchOff.svg';
import devicePushButton from '@/assets/images/devices/entry/pushButtonOff.svg';
import deviceDht from '@/assets/images/devices/entry/dht.svg';
import deviceInfrared from '@/assets/images/devices/entry/infrared.svg';
// import deviceSoilMoisture from '@/assets/images/devices/event/eventBase.svg';
// import deviceRainDetector from '@/assets/images/devices/event/eventBase.svg';

//exit
import deviceLed from '@/assets/images/devices/exit/led.svg';
import deviceLedMono from '@/assets/images/devices/exit/ledMono.svg';
import deviceLaser from '@/assets/images/devices/exit/laser.svg';
import deviceShakeMotor from '@/assets/images/devices/exit/shakeMotor.svg';
import deviceBuzzer from '@/assets/images/devices/exit/buzzer.svg';
import deviceTimer from '@/assets/images/devices/exit/timer.svg';
// import deviceBargraph from '@/assets/images/devices/event/eventBase.svg';

//conditional
import deviceAnd from '@/assets/images/devices/conditional/and.svg';
import deviceOr from '@/assets/images/devices/conditional/or.svg';
import deviceNot from '@/assets/images/devices/conditional/not.svg';
import deviceComparator from '@/assets/images/devices/conditional/comparator.svg';
import deviceIf from '@/assets/images/devices/conditional/comparator.svg';
import deviceCounter from '@/assets/images/devices/conditional/counter/counter.svg';

//event
import devicePickColor from '@/assets/images/devices/event/pickcolor.svg';
import deviceToggle from '@/assets/images/devices/event/toggle.svg';
import deviceDelay from '@/assets/images/devices/event/delay.svg';
import deviceSlider from '@/assets/images/devices/event/slider.svg';
import deviceLoop from '@/assets/images/devices/event/loop.svg';

//tool
import deviceStickynote from '@/assets/images/devices/tool/stickyNote.svg'

export const mockDevices = {
  entry: [
    {
      id: 10,
      imgSrc: deviceDht,
      name: 'dht',
      label: 'Sensor de temperatura',
      type: 'virtual',
      category: 'entry',
      value: {
        temperature: {
          current: 0,
          max: 50
        },
        humidity: {
          current: 0,
          max: 1023
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        temperature: {
          id: null,
          type: 'exit',
          name: 'temperature',
          x: 0,
          y: 0
        },
        humidity: {
          id: null,
          type: 'exit',
          name: 'humidity',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 11,
      imgSrc: deviceInfrared,
      name: 'infrared',
      label: 'Sensor infravermelho',
      type: 'virtual',
      category: 'entry',
      value: {
        code: {
          current: 'FF12F3'
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        code: {
          id: null,
          name: 'code',
          type: 'exit',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 12,
      imgSrc: deviceLdr,
      name: 'ldr',
      label: 'Sensor de luz',
      type: 'virtual',
      category: 'entry',
      value: {
        luminosity: {
          current: 0,
          max: 1023
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        luminosity: {
          id: null,
          name: 'luminosity',
          type: 'exit',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 13,
      imgSrc: devicePotentiometer,
      name: 'potentiometer',
      label: 'Potênciometro',
      type: 'virtual',
      category: 'entry',
      value: {
        resistance: {
          current: 0,
          max: 1023
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        resistance: {
          id: null,
          name: 'resistance',
          type: 'exit',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 14,
      imgSrc: devicePushButton,
      name: 'pushButton',
      label: 'Botão',
      type: 'virtual',
      category: 'entry',
      value: {
        state: {
          current: false
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        state: {
          id: null,
          name: 'state',
          type: 'exit',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 15,
      imgSrc: deviceSwitch,
      name: 'switch',
      label: 'Switch',
      type: 'virtual',
      category: 'entry',
      value: {
        state: {
          current: false
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        state: {
          id: null,
          name: 'state',
          type: 'exit',
          x: 0,
          y: 0
        }
      }

    },
    // {
    //   id: 16,
    //   imgSrc: deviceRainDetector,
    //   name: 'rainDetector',
    //   label: 'Sensor de radiação',
    //   type: 'virtual',
    //   category: 'entry',
    //   value: {
    //     radiation: {
    //       current: 0,
    //       max: 1023
    //     }
    //   },
    //   posX: 0,
    //   posY: 0,
    //   connectors: {
    //     radiation: {
    //       id: null,
    //       name: 'radiation',
    //       type: 'exit',
    //       x: 0,
    //       y: 0
    //     }
    //   }
    // },
    // {
    //   id: 17,
    //   imgSrc: deviceSoilMoisture,
    //   name: 'soilMoisture',
    //   label: 'Sensor de humidade do solo',
    //   type: 'virtual',
    //   category: 'entry',
    //   value: {
    //     humidity: {
    //       current: 0,
    //       max: 1023
    //     }
    //   },
    //   posX: 0,
    //   posY: 0,
    //   connectors: {
    //     humidity: {
    //       id: null,
    //       name: 'humidity',
    //       type: 'exit',
    //       x: 0,
    //       y: 0
    //     }
    //   }
    // }
  ],
  exit: [
    {
      id: 20,
      imgSrc: deviceLed,
      name: 'led',
      label: 'Led',
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
      },
      posX: 0,
      posY: 0,
      connectors: {
        brightness: {
          id: null,
          name: 'brightness',
          type: 'entry',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 21,
      imgSrc: deviceLedMono,
      name: 'ledMono',
      label: 'Led mono',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        opacity: 0,
        brightness: 1023
      },
      posX: 0,
      posY: 0,
      connectors: {
        lumen: {
          id: null,
          name: 'lumen',
          type: 'entry',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 22,
      imgSrc: deviceLaser,
      name: 'laser',
      label: 'Laser',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        opacity: 0,
        brightness: 1023
      },
      posX: 0,
      posY: 0,
      connectors: {
        intensity: {
          id: null,
          name: 'intensity',
          type: 'entry',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 23,
      imgSrc: deviceShakeMotor,
      name: 'shakeMotor',
      label: 'Shake motor',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null
      },
      posX: 0,
      posY: 0,
      connectors: {
        vibration: {
          id: null,
          name: 'vibration',
          type: 'entry',
          x: 0,
          y: 0
        }
      }
    },
    {
      id: 24,
      imgSrc: deviceBuzzer,
      name: 'buzzer',
      label: 'Buzzer',
      type: 'virtual',
      category: 'exit',
      value: {
        active: false,
        current: 0,
        max: 0,
        type: null,
        duration: 4,
        volume: 0.5,
      },
      posX: 0,
      posY: 0,
      connectors: {
        frequency: {
          id: null,
          name: 'frequency',
          type: 'entry',
          x: 0,
          y: 0,
        }
      }
    },
    {
      id: 26,
      imgSrc: deviceTimer,
      name: 'timer',
      label: 'Cronômetro',
      type: 'virtual',
      category: 'exit',
      value: {
        current: 0
      },
      posX: 0,
      posY: 0,
      connectors: {
        active: {
          id: null,
          name: 'active',
          type: 'entry',
          x: 0,
          y: 0,
        },
        reset: {
          id: null,
          name: 'reset',
          type: 'entry',
          x: 0,
          y: 0,
        },
      }
    },
    // {
    //   id: 25,
    //   imgSrc: deviceBargraph,
    //   name: 'bargraph',
    //   label: 'Bargraph',
    //   type: 'virtual',
    //   category: 'exit',
    //   value: {
    //     active: false,
    //     current: 0,
    //     max: 0,
    //     type: null,
    //     opacity: 0,
    //     brightness: 1023
    //   },
    //   posX: 0,
    //   posY: 0,
    //   connectors: {
    //     lumen: {
    //       id: null,
    //       name: 'lumen',
    //       type: 'entry',
    //       x: 0,
    //       y: 0
    //     }
    //   }
    // },
  ],
  event: [
    {
      id: 30,
      imgSrc: devicePickColor,
      name: 'pickColor',
      label: 'Pick color',
      type: 'virtual',
      category: 'event',
      value: {
        send: {
          current: 0,
          max: 0,
          color: '#39394E'
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 31,
      imgSrc: deviceToggle,
      name: 'toggle',
      label: 'Toggle',
      type: 'virtual',
      category: 'event',
      value: {
        send: {
          current: false
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 32,
      imgSrc: deviceDelay,
      name: 'delay',
      label: 'Delay',
      type: 'virtual',
      category: 'event',
      value: {
        send: {
          current: 0,
          max: 0
        },
        duration: 5,
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 33,
      imgSrc: deviceSlider,
      name: 'slider',
      label: 'Slider',
      type: 'virtual',
      category: 'event',
      value: {
        send: {
          current: 0,
          max: 0
        },
        limit: 1023
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 34,
      imgSrc: deviceLoop,
      name: 'loop',
      label: 'Loop',
      type: 'virtual',
      category: 'event',
      value: {
        send: {
          current: 0,
          max: 0
        },
        duration: 5,
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 35,
      imgSrc: deviceDelay,
      name: 'passValue',
      label: 'Passa valores',
      type: 'virtual',
      category: 'event',
      value: {
        send: {
          current: 5,
        },
        sendValue: false,
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
  ],
  conditional: [
    {
      id: 40,
      imgSrc: deviceAnd,
      name: 'and',
      label: 'And',
      type: 'virtual',
      category: 'conditional',
      value: {
        send: {
          current: false
        },
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 41,
      imgSrc: deviceOr,
      name: 'or',
      label: 'Or',
      type: 'virtual',
      category: 'conditional',
      value: {
        send: {
          current: false,
          color: '#39394E'
        },
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 42,
      imgSrc: deviceNot,
      name: 'not',
      label: 'Not',
      type: 'virtual',
      category: 'conditional',
      value: {
        send: {
          current: false
        }
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 43,
      imgSrc: deviceComparator,
      name: 'comparator',
      label: 'Comparador',
      type: 'virtual',
      category: 'conditional',
      value: {
        send: {
          current: false,
        },
        simbol: '=',
        connectionType: 'number',
        numberDisplay: 0
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 44,
      imgSrc: deviceCounter,
      name: 'counter',
      label: 'Contador',
      type: 'virtual',
      category: 'conditional',
      value: {
        send: {
          current: 0,
          max: 1023
        },
        loopActive: false,
        loopLimit: 9999
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        send: {
          id: null,
          name: 'send',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
    {
      id: 45,
      imgSrc: deviceIf,
      name: 'if',
      label: 'If',
      type: 'virtual',
      category: 'conditional',
      value: {
        sendIf: {
          current: false,
        },
        sendElse: {
          current: true,
        },
        simbol: '=',
        connectionType: 'number',
        numberDisplay: 0
      },
      posX: 0,
      posY: 0,
      connectors: {
        receive: {
          id: null,
          name: 'receive',
          type: 'entry',
          x: 0,
          y: 0
        },
        sendIf: {
          id: null,
          name: 'sendIf',
          type: 'exit',
          x: 0,
          y: 0
        },
        sendElse: {
          id: null,
          name: 'sendElse',
          type: 'exit',
          x: 0,
          y: 0
        },
      }
    },
  ],
  tool: [
    {
      id: 51,
      imgSrc: deviceStickynote,
      name: 'stickynote',
      label: 'Bloco de Notas',
      type: 'virtual',
      category: 'tool',
      value: {
        text: '',
        color: '#F5B9B9'
      },
      posX: 0,
      posY: 0
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
    connectsTo: ['comparator', 'if']
  },
  led: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['all']
  },
  buzzer: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['potentiometer', 'ldr', 'rainDetector', 'soilMoisture', 'pushButton', 'counter', 'and', 'or', 'not', 'comparator', 'if', 'toggle', 'slider', 'delay', 'switch', 'physicalPotentiometer', 'physicalLDR']
  },
  shakeMotor: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['potentiometer', 'ldr', 'rainDetector', 'soilMoisture', 'pushButton', 'counter', 'and', 'or', 'not', 'comparator', 'if', 'toggle', 'slider', 'delay', 'switch', 'physicalPotentiometer', 'physicalLDR']
  },
  ledMono: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['all']
  },
  laser: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['all']
  },
  bargraph: {
    acceptedConnections: ['oneEntry'],
    connectsFrom: ['potentiometer', 'dht', 'ldr', 'rainDetector', 'soilMoisture', 'counter', 'slider', 'physicalPotentiometer', 'physicalLDR', 'physicalDHT'],
  },
  counter: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all']
  },
  and: {
    acceptedConnections: ['allEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all']
  },
  or: {
    acceptedConnections: ['allEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  not: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  comparator: {
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
    connectsTo: ['or','led', 'physicalLED'],
  },
  slider: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['potentiometer', 'dht', 'ldr', 'rainDetector', 'soilMoisture', 'counter', 'slider', 'physicalPotentiometer', 'physicalLDR', 'physicalDHT'],
    connectsTo: ['all'],
  },
  passValue: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
  sticknote: {
    acceptedConnections: ['oneEntry', 'allExit'],
    connectsFrom: ['all'],
    connectsTo: ['all'],
  },
}
