import { memo } from 'react';
import P from 'prop-types';
import { useDrag } from 'react-dnd';

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

import {
  deviceContainer,
  deviceContent,
} from './styles.module.css';



const Device = memo(function Device({ device: { ...device } }) {
  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'device',
    item: {
      ...device,
    },
  }), []);

  const devices = {
    'ldr': <Ldr
      device={device}
      dragRef={drag}
    />,
    'potentiometer': <Potentiometer
      device={device}
      dragRef={drag}
    />,
    'pushButton': <PushButton
      device={device}
      dragRef={drag}
    />,
    'switch': <Switch
      device={device}
      dragRef={drag}
    />,
    'led': <Led
      device={device}
      dragRef={drag}
    />,
    'ledMono': <LedMono
      device={device}
      dragRef={drag}
    />,
    'laser': <Laser
      device={device}
      dragRef={drag}
    />,
    'shakeMotor': <ShakeMotor
      device={device}
      dragRef={drag}
    />,
    'buzzer': <Buzzer
    device={device}
    dragRef={drag}
    />,
    'and': <And
      device={device}
      dragRef={drag}
    />,
    'or': <Or
      device={device}
      dragRef={drag}
    />,
    'not': <Not
      device={device}
      dragRef={drag}
    />
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
          {CurrentDevice}
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
