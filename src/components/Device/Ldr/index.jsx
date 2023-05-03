import { useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { FaTrashAlt } from 'react-icons/fa';

import Connector from '@/components/Connector';
import {
    deviceContainer,
    deviceContent,
    deviceBody,
    inputContainer,
    inputValue,
    actionButtonsContainer
} from '../styles.module.css';

import ActionButton from '../../ActionButton';

const MAX_VALUE = 1023;
const Ldr = ({ device }) => {
    const inputRef = useRef(null);
    const showValueRef = useRef(null);

    const [{ }, drag] = useDrag(() => ({
        type: 'device',
        item: { ...device }
    }), []);

    const handleOnInput = () => {
        const input = inputRef.current;

        showValueRef.current.innerHTML = input.value;
    }

    return (
        <div
            className={deviceContainer}
            style={{ left: `${device.posX}px`, top: `${device.posY}px` }}
        >
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
                className={deviceContent}
            >
                <div className={actionButtonsContainer}>
                    <ActionButton
                        onClick={() => console.log('Clicando no delete')}
                    >
                        <FaTrashAlt />
                    </ActionButton>

                    <ActionButton
                        onClick={() => console.log('Clicando no delete')}
                    >
                        <FaTrashAlt />
                    </ActionButton>

                    <ActionButton
                        onClick={() => console.log('Clicando no delete')}
                    >
                        <FaTrashAlt />
                    </ActionButton>
                </div>

                <div
                    className={deviceBody}
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