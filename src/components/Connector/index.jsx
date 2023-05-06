
import { memo } from 'react';
import styles, {
    connector,
    connectorRange,
} from './styles.module.css';

import { useDrop, useDrag } from 'react-dnd';

const Connector = ({ type }) => {

    const [{ }, drop] = useDrop(() => ({
        accept: 'connector',
        drop: () => console.log('Connector dropped')
    }), []);

    const [{ }, drag] = useDrag(() => ({
        type: 'connector',
        item: {},
    }), []);

    const attachRef = (el) => {
        drag(el)
        drop(el)
    }

    return (
        <div
            className={`${connector} ${styles[`${type}Connector`]}`}
            onTouchStart={(event) => console.log(event)}
        >
            <div
                className={`${connectorRange} ${styles[`${type}ConnectorRange`]}`}
                ref={attachRef}
            >
            </div>
        </div>
    );
};

export default memo(Connector);