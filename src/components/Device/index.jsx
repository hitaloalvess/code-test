import { memo } from 'react';
import P from 'prop-types';
import { useDrag } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices.js';

import Dht from './Entry/Dht';
import Ldr from './Entry/Ldr';
import Potentiometer from './Entry/Potentiometer';
import Switch from './Entry/Switch';
import PushButton from './Entry/PushButton';
import Infrared from './Entry/Infrared';

import Led from './Exit/Led';
import LedMono from './Exit/LedMono';
import Laser from './Exit/Laser';
import ShakeMotor from './Exit/ShakeMotor';
import Buzzer from './Exit/Buzzer';

import And from './Conditional/And';
import Or from './Conditional/Or';
import Not from './Conditional/Not';
import If from './Conditional/If';
import Counter from './Conditional/Counter';

import Toggle from './Event/Toggle';
import Delay from './Event/Delay';
import Slider from './Event/Slider';
import PickColor from './Event/PickColor';

import {
  deviceContainer,
  deviceContent,
} from './styles.module.css';



const Device = memo(function Device({ device: { ...device } }) {
  const { deviceScale, updateDeviceValue } = useDevices();

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'device',
    item: {
      ...device,
    },
  }), []);

  const updateValue = (callbackUpdate, deviceId, value) => {
    if (callbackUpdate) callbackUpdate(value);

    updateDeviceValue(deviceId, {
      value
    });
  }

  const devices = {
    dht: Dht,
    ldr: Ldr,
    potentiometer: Potentiometer,
    pushButton: PushButton,
    switch: Switch,
    infrared: Infrared,
    led: Led,
    ledMono: LedMono,
    laser: Laser,
    shakeMotor: ShakeMotor,
    buzzer: Buzzer,
    and: And,
    or: Or,
    not: Not,
    if: If,
    toggle: Toggle,
    delay: Delay,
    slider: Slider,
    pickColor: PickColor,
    counter: Counter
  }

  const CurrentDevice = devices[device.name];

  if (!CurrentDevice) {
    return;
  }

  return (
    <>
      <div
        className={deviceContainer}
        style={{ left: `${device.posX}px`, top: `${device.posY}px`, transform: `scale(${deviceScale})` }}
      >
        <div
          className={deviceContent}
        >
          {
            <CurrentDevice
              device={device}
              dragRef={drag}
              updateValue={updateValue}
            />
          }
        </div>
      </div>
    </>
  )
});

Device.propTypes = {
  device: P.shape({
    id: P.string,
    name: P.string.isRequired,
    imgSrc: P.string,
    type: P.string,
    category: P.string,
    posX: P.number.isRequired,
    posY: P.number.isRequired,
    draggedDevice: P.object
  }),
}

export default Device;
