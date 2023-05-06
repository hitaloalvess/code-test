import { memo, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { FaTrashAlt } from 'react-icons/fa'

import { useModal } from '@/hooks/useModal';
import ActionButton from '@/components/ActionButton';
import Connector from '@/components/Connector';

import {
    deviceBody,
    inputRangeDeviceContainer,
    inputValue,
    actionButtonsContainer,
    actionButtonsContainerLeft
} from '../styles.module.css';

const MAX_VALUE = 1023;
const Ldr = ({ imgSrc, name, handleDelete, ...device }) => {
    const inputRef = useRef(null);
    const showValueRef = useRef(null);

    const { enableModal, disableModal } = useModal();
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
            <div className={inputRangeDeviceContainer}>
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

            <div
                className={
                    `${actionButtonsContainer} ${actionButtonsContainerLeft}`
                }
            >
                <ActionButton
                    onClick={() => enableModal({
                        typeContent: 'confirmation',
                        title: 'Cuidado',
                        subtitle: 'Tem certeza que deseja excluir o componente?',
                        handleConfirm: () => {
                            handleDelete(device.id);
                            disableModal();
                        }
                    })}
                >
                    <FaTrashAlt />
                </ActionButton>

            </div>
        </>
    );
};

export default memo(Ldr);