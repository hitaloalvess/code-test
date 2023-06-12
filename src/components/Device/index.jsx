import { memo } from 'react';
import P from 'prop-types';
import { useDrag } from 'react-dnd';

import { useDevices } from '@/hooks/useDevices.js';

import Ldr from './Entry/Ldr';
import Potentiometer from './Entry/Potentiometer';
import Switch from './Entry/Switch';
import PushButton from './Entry/PushButton';

import Led from './Exit/Led';
import LedMono from './Exit/LedMono';
import Laser from './Exit/Laser';
import ShakeMotor from './Exit/ShakeMotor';
import Buzzer from './Exit/Buzzer';

import And from './Conditional/And';
import Or from './Conditional/Or';
import Not from './Conditional/Not';

import Toggle from './Event/Toggle';
import Delay from './Event/Delay';

import {
  deviceContainer,
  deviceContent,
} from './styles.module.css';



const Device = memo(function Device({ device: { ...device } }) {

  const { updateDeviceValue } = useDevices();

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
    ldr: Ldr,
    potentiometer: Potentiometer,
    pushButton: PushButton,
    switch: Switch,
    led: Led,
    ledMono: LedMono,
    laser: Laser,
    shakeMotor: ShakeMotor,
    buzzer: Buzzer,
    and: And,
    or: Or,
    not: Not,
    toggle: Toggle,
    delay: Delay
  }

  const CurrentDevice = devices[device.name];

  if (!CurrentDevice) {
    return;
  }

  return (
    <>
      <div
        className={deviceContainer}
        style={{ left: `${device.posX}px`, top: `${device.posY}px` }}
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
