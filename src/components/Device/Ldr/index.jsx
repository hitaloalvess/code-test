import { memo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

import Connector from '@/components/Connector';

import {
    deviceBody,
    inputContainer,
    inputValue
} from '../styles.module.css';

const MAX_VALUE = 1023;
const Ldr = ({ imgSrc, name, ...device }) => {

    const inputRef = useRef(null);
    const showValueRef = useRef(null);

    const [{ }, drag] = useDrag(() => ({
        type: 'device',
        item: { imgSrc, name, ...device }
    }), []);

    const handleOnInput = () => {
        const input = inputRef.current;

        showValueRef.current.innerHTML = input.value;
    }

    return (

        <>
            <div className={inputContainer}>
                <input
                    type="range"
                    min="0"
                    max="1023"
                    step="1"
                    onInput={handleOnInput}
                    ref={inputRef}
                />
                <p
                    className={inputValue}
                    ref={showValueRef}
                >0</p>
            </div>

            <div
                className={deviceBody}
                ref={drag}
            >
                <img
                    src={imgSrc}
                    alt={`Device ${name}`}
                    loading='lazy'
                />
            </div>
            <div>
                <Connector type={'exit'} />
            </div>
        </>
    );
};

export default memo(Ldr);