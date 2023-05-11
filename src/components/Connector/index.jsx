
import { memo, useEffect, useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import P from 'prop-types';

import { useFlow } from '@/hooks/useFlow';

import { calcPositionConnector } from '../../utils/flow-functions';

import styles, {
  connector,
  connectorRange,
} from './styles.module.css';


const Connector = memo(function Connector({
  type, idDevice, updateConn, refConn
}) {
  const connRef = useRef(null);

  const { flowTemp, createFlow, deleteLine } = useFlow();
  const [position, setPosition] = useState({
    x: 0, y: 0
  });

  useEffect(() => {
    const { x, y } = calcPositionConnector(connRef.current);
    setPosition({ x, y });

  }, [updateConn]);



  // eslint-disable-next-line no-empty-pattern
  const [{ }, drop] = useDrop(() => ({
    accept: 'connector',
    drop: (item) => {
      const { connectorPosFrom } = item;

      deleteLine({
        id: flowTemp.currentLine.id
      });

      createFlow({
        idDevices: {
          from: item.idDevice,
          to: idDevice
        },
        connectors: {
          from: { ...connectorPosFrom },
          to: { ...position }
        },
        lineId: null
      })
    }
  }), [flowTemp, position]);

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'connector',
    item: {
      idDevice,
      connectorPosFrom: {
        ...position,
        type
      }
    },
  }), [position]);

  const attachRef = (el) => {
    drag(el);
    drop(el);
  }

  const attachRefConn = (el) => {
    connRef.current = el;
    refConn.current = el;
  }

  return (
    <div
      ref={attachRefConn}
      className={`${connector} ${styles[`${type}Connector`]}`}
      onTouchStart={() => createFlow({
        idDevices: {
          from: idDevice,
          to: null
        },
        connectors: {
          from: {
            ...position
          },
          to: null
        },
        lineId: null,
      })}
      onMouseDown={() => createFlow({
        idDevices: {
          from: idDevice,
          to: null
        },
        connectors: {
          from: {
            ...position,
            type
          },
          to: null
        },
        lineId: null
      })}
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
  type: P.string.isRequired,
  idDevice: P.string.isRequired,
  updateConn: P.number.isRequired,
  refConn: P.object.isRequired
}

export default Connector;
