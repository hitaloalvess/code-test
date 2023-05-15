
import { memo, useEffect, useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { useFlow } from '@/hooks/useFlow';

import { calcPositionConnector } from '../../utils/flow-functions';

import styles, {
  connector,
  connectorRange,
} from './styles.module.css';


const Connector = memo(function Connector({
  name, type, device, updateConn, refConn
}) {
  const connRef = useRef(null);

  const { flowTemp, createFlow, deleteLine } = useFlow();
  const [id] = useState(() => {
    return `${name}-${uuid()}`
  })
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
      deleteLine({
        id: flowTemp.currentLine.id
      });

      createFlow({
        devices: {
          from: { ...item },
          to: {
            ...device,
            connector: {
              ...position,
              id,
              name,
              type,
              ref: connRef
            }
          }
        },
        lineId: null
      })
    }
  }), [flowTemp, position]);

  // eslint-disable-next-line no-empty-pattern
  const [{ }, drag] = useDrag(() => ({
    type: 'connector',
    item: {
      ...device,
      connector: {
        ...position,
        id,
        name,
        type,
        ref: connRef
      },
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

  const handleConnDown = () => {
    createFlow({
      devices: {
        from: {
          ...device,
          connector: {
            ...position,
            type,
            ref: connRef
          },
        },
        to: null
      },
      lineId: null
    })
  }
  return (
    <div
      ref={attachRefConn}
      className={`${connector} ${styles[`${type}Connector`]}`}
      onTouchStart={handleConnDown}
      onMouseDown={() => handleConnDown()}
      onMouseUp={() => deleteLine({
        id: flowTemp.currentLine.id
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
  name: P.string.isRequired,
  type: P.string.isRequired,
  device: P.object.isRequired, //ARRUMAR AQUI -> COLOCAR O OBJETO CORRETO
  updateConn: P.number.isRequired,
  refConn: P.object.isRequired
}

export default Connector;
