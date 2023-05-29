
import { useEffect, useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';

import { calcPositionConnector } from '../../utils/flow-functions';

import styles, {
  connector,
  connectorRange,
} from './styles.module.css';


const Connector = ({
  name, type, device, updateConn
}) => {
  const {
    flows,
    flowTemp,
    createFlow,
    deleteLine,
    clearFlowTemp,
    connectionLines,
    updateLines,
    updateFlow
  } = useFlow();
  const { repositionConnections } = useDevices();

  const connRef = useRef(null);
  const [id] = useState(() => {
    return `${name}-${uuid()}`
  })
  const [position, setPosition] = useState({
    x: 0, y: 0
  });

  useEffect(() => {
    const { x, y } = calcPositionConnector(connRef.current);
    setPosition({ x, y });

    repositionConnections({
      device: {
        id: device.id,
        posX: updateConn.posX,
        posY: updateConn.posY
      },
      connector: {
        id,
        posX: x,
        posY: y
      },
      flows,
      connectionLines,
      updateLines,
      updateFlow
    })

  }, [updateConn.posX, updateConn.posY]);



  // eslint-disable-next-line no-empty-pattern
  const [{ }, drop] = useDrop(() => ({
    accept: 'connector',
    drop: (item) => {

      clearFlowTemp();

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
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        //dropped in invalid local
        deleteLine({
          id: flowTemp.currentLine.id
        })
      }
    }
  }), [position, flowTemp]);

  const attachRef = (el) => {
    drag(el);
    drop(el);
  }

  const attachRefConn = (el) => {
    connRef.current = el;
    // refConn.current = el;
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
      id={id}
    >
      <div
        className={`${connectorRange}`}
        ref={attachRef}
      >
      </div>
    </div>
  );
};


Connector.propTypes = {
  name: P.string.isRequired,
  type: P.string.isRequired,
  device: P.shape({
    id: P.string.isRequired,
    defaultBehavior: P.func.isRequired
  }),
  // refConn: P.object.isRequired,
  updateConn: P.shape({
    posX: P.number.isRequired,
    posY: P.number.isRequired
  })
}

export default Connector;
