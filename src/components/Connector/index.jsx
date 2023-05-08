
import { memo } from 'react';
import P from 'prop-types';

import styles, {
  connector,
  connectorRange,
} from './styles.module.css';

import { useDrop, useDrag } from 'react-dnd';

const Connector = memo(function Connector({ type }) {

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drop] = useDrop(() => ({
    accept: 'connector',
    drop: () => console.log('Connector dropped')
  }), []);

  // eslint-disable-next-line no-empty-pattern
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
});

Connector.propTypes = {
  type: P.string.isRequired
}

export default Connector;
