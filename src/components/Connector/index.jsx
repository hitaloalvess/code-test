/* eslint-disable no-empty-pattern */
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
  entryConnectorRange,
  exitConnectorRange
} from './styles.module.css';


const Connector = ({
  name, type, device, updateConn, handleChangeId = null
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
  const { repositionConnections, deviceScale } = useDevices();

  const connRef = useRef(null);
  const [id] = useState(() => {
    return `${name}-${uuid()}`
  })
  const [position, setPosition] = useState({
    x: 0, y: 0
  });

  useEffect(() => {
    const { x, y } = calcPositionConnector(connRef.current, device.containerRef);
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

  }, [updateConn.posX, updateConn.posY, deviceScale]);


  useEffect(() => {
    if (handleChangeId) {
      handleChangeId(id);
    }
  }, [id]);


  const [{ }, drop] = useDrop(() => ({
    accept: 'connector',
    drop: (item) => {

      if (item.connector.id === id) {
        //If the line is dropped within the range of the device connector itself, it will be deleted.
        deleteLine({ id: flowTemp.currentLine.id })
      }

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
      onTouchStart={(event) => {
        event.stopPropagation();
        handleConnDown();
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
        handleConnDown()
      }}
      onMouseUp={(event) => {
        event.stopPropagation();

        deleteLine({
          id: flowTemp.currentLine.id
        });
      }}
      id={id}
    >
      <div
        className={`${connectorRange} ${type === 'entry' ? entryConnectorRange : exitConnectorRange}`}
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
    defaultBehavior: P.func.isRequired,
    containerRef: P.object.isRequired
  }),
  updateConn: P.shape({
    posX: P.number.isRequired,
    posY: P.number.isRequired
  }),
  handleChangeId: P.func
}

export default Connector;
