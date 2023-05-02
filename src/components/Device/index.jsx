import Ldr from './Ldr';
import Led from './Led';

const Device = ({ device }) => {
    const devices = {
        'ldr': <Ldr device={device} />,
        'led': <Led device={device} />
    }

    const currentDevice = devices[device.name];

    if (currentDevice) {
        return currentDevice;
    }
};

export default Device;