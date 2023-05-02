import { useDrag } from 'react-dnd';

import { handleInputRange } from '@/utils/devices-functions';
import Connector from '@/components/Connector';

import {
    ldrContainer,
    ldrContent,
    ldrBody
} from './styles.module.css';

import {
    inputContainer,
    inputValue
} from '@/styles/common.module.css';

const Ldr = ({ device }) => {

    const [{ }, drag] = useDrag(() => ({
        type: 'device',
        item: { ...device }
    }), []);


    return (
        <div
            className={ldrContainer}
            style={{ left: `${device.posX}px`, top: `${device.posY}px` }}
        >
            <div className={inputContainer}>
                <input
                    type="range"
                    min="0"
                    max="1023"
                    step="1"
                    defaultValue="0"
                    onInput={handleInputRange}
                />
                <p className={inputValue}>0</p>
            </div>
            <div
                className={ldrContent}
            >
                <div
                    className={ldrBody}
                    ref={drag}
                >
                    <img
                        src={device.imgSrc}
                        alt={`Device ${device.name}`}
                        loading='lazy'
                    />
                </div>
                <div>
                    <Connector type={'exit'} />
                </div>
            </div>
        </div >
    );
};

export default Ldr;