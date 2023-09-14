/* eslint-disable no-empty-pattern */
import { useEffect, useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { calcPositionConnector } from '@/utils/flow-functions';

import styles, {
  connector,
  connectorRange,
  entryConnectorRange,
  exitConnectorRange
} from './styles.module.css';

import { useStore } from '@/store';
import { shallow } from 'zustand/shallow';

const ConnectorsConnector = ({
  data, device, updateConn, handleChangeData
}) => {

  const {
    platformContainerRef,
    createFlow,
    deleteLine,
    flowTemp,
    repositionConnections,
    scale
  } = useStore(store => ({
    platformContainerRef: store.platformContainerRef,
    createFlow: store.createFlow,
    deleteLine: store.deleteLine,
    flowTemp: store.flowTemp,
    repositionConnections: store.repositionConnections,
    scale: store.scale
  }), shallow);


  const connRef = useRef(null);
  const [id] = useState(() => data?.id || `${data.name}-${uuid()}`);
  const [position, setPosition] = useState({
    x: 0, y: 0
  });


  useEffect(() => {
    if (!platformContainerRef?.current) return;

    const { x, y } = calcPositionConnector(connRef.current, platformContainerRef);
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
    })

    if (handleChangeData) {
      handleChangeData('connectors', {
        [`${data.name}`]: {
          ...data,
          id,
          type: data.type,
          name: data.name,
          x,
          y
        }
      });
    }

  }, [updateConn.posX, updateConn.posY, scale, platformContainerRef.current]);


  const [{ }, drop] = useDrop(() => ({
    accept: 'connector',
    drop: (item) => {

      if (item.connector.id === id) {
        //If the line is dropped within the range of the device connector itself, it will be deleted.
        deleteLine(flowTemp.currentLine.id)
      }

      createFlow({
        devices: {
          from: { ...item },
          to: {
            ...device,
            connector: {
              ...position,
              id,
              name: data.name,
              type: data.type,
            }
          }
        },
        lineId: null
      })
    }
  }), [position, flowTemp]);

  const [{ }, drag] = useDrag(() => ({
    type: 'connector',
    item: {
      ...device,
      connector: {
        ...position,
        id,
        name: data.name,
        type: data.type,
      },
    },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        //dropped in invalid local
        deleteLine(flowTemp.currentLine.id)
      }
    }
  }), [position, flowTemp]);

  const attachRef = (el) => {
    drag(el);
    drop(el);
  }

  const handleConnDown = () => {

    createFlow({
      devices: {
        from: {
          ...device,
          connector: {
            ...position,
            type: data.type,
            ref: connRef
          },
        },
        to: null
      },
    })
  }

  return (
    <div
      ref={connRef}
      className={`${connector} ${styles[`${data.type}Connector`]}`}

      id={id}
    >
      <div
        className={`${connectorRange} ${data.type === 'entry' ? entryConnectorRange : exitConnectorRange}`}
        ref={attachRef}
        onTouchStart={() => handleConnDown()}
        onMouseDown={() => handleConnDown()}
      >
      </div>
    </div>
  );
};


ConnectorsConnector.propTypes = {
  data: P.shape({
    id: P.string,
    name: P.string.isRequired,
    type: P.string.isRequired,
  }),
  device: P.shape({
    id: P.string.isRequired,
  }),
  updateConn: P.shape({
    posX: P.number.isRequired,
    posY: P.number.isRequired
  }),
  handleChangeData: P.func,
}

export default ConnectorsConnector;
