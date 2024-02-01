import P from 'prop-types';

import Climate from '../../Entry/Climate';
import Photoresist from '../../Entry/Photoresist';
import Potentiometer from '../../Entry/Potentiometer';
import Switch from '../../Entry/Switch';
import PushButton from '../../Entry/PushButton';
import Infrared from '../../Entry/Infrared';
import Soil from '../../Entry/Soil';
import Rain from '../../Entry/Rain';

import Led from '../../Exit/Led';
import LedMono from '../../Exit/LedMono';
import Laser from '../../Exit/Laser';
import ShakeMotor from '../../Exit/ShakeMotor';
import Buzzer from '../../Exit/Buzzer';
import Timer from '../../Exit/Timer';
import Bargraph from '../../Exit/Bargraph';

import And from '../../Conditional/And';
import Or from '../../Conditional/Or';
import Not from '../../Conditional/Not';
import Comparator from '../../Conditional/Comparator';
import Counter from '../../Conditional/Counter';
import If from '../../Conditional/If';

import Toggle from '../../Event/Toggle';
import Delay from '../../Event/Delay';
import Slider from '../../Event/Slider';
import PickColor from '../../Event/PickColor';
import Loop from '../../Event/Loop';
import PassValue from '../../Event/PassValue';

import Stickynote from '../../Tool/Stickynote';

import PhysicalClimate from '../../Physical/Climate';

const DeviceFactory = ({
  data, dragRef, onSaveData
}) => {

  const devices = {
    climate: Climate,
    photoresist: Photoresist,
    potentiometer: Potentiometer,
    pushButton: PushButton,
    switch: Switch,
    infrared: Infrared,
    led: Led,
    ledMono: LedMono,
    laser: Laser,
    shakeMotor: ShakeMotor,
    buzzer: Buzzer,
    bargraph: Bargraph,
    and: And,
    or: Or,
    not: Not,
    comparator: Comparator,
    if: If,
    toggle: Toggle,
    delay: Delay,
    slider: Slider,
    pickColor: PickColor,
    counter: Counter,
    soil: Soil,
    rain: Rain,
    timer: Timer,
    loop: Loop,
    stickynote: Stickynote,
    passValue: PassValue,
    physicalClimate: PhysicalClimate,
  }

  const CurrentDevice = devices[data.name];

  if (!CurrentDevice) {
    return;
  }

  return (
    <CurrentDevice
      data={data}
      dragRef={dragRef}
      onSaveData={onSaveData}
    />
  )
};

DeviceFactory.propTypes = {
  data: P.shape({
    id: P.string,
    name: P.string.isRequired,
    imgSrc: P.string,
    type: P.string,
    category: P.string,
    posX: P.number.isRequired,
    posY: P.number.isRequired,
    draggedDevice: P.object
  }).isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default DeviceFactory;
