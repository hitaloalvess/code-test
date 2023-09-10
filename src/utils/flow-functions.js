import { deviceConnectorRules } from '@/data/devices.js';
export const calcPositionConnector = (connector, containerRef) => {

  const {
    left: connectorLeft,
    right: connectorRight,
    top: connectorTop,
    bottom: connectorBottom
  } = connector.getBoundingClientRect();

  const scrollLeft = containerRef.current.scrollLeft;
  const scrollTop = containerRef.current.scrollTop;

  const posLeft = connectorLeft + scrollLeft;
  const posRight = connectorRight + scrollLeft
  const posTop = connectorTop + scrollTop;
  const posBottom = connectorBottom + scrollTop;


  const x = ((posLeft + posRight) / 2);
  const y = ((posTop + posBottom) / 2);

  return {
    x,
    y,
    left: posLeft,
    right: posRight,
    top: posTop,
    bottom: posBottom
  }
}

export const findFlowsByDeviceId = (flows, deviceId) => {
  const listFlows = Object.values(flows);

  if (listFlows.length <= 0) return;

  const isConn = conn => {
    return (conn.deviceFrom.id === deviceId ||
      conn.deviceTo.id === deviceId);
  }

  const getByDevice = flow => {
    return flow.connections.find(isConn);
  }

  const foundFlow = listFlows.find(getByDevice);

  return foundFlow;
}

export const findFlowByConnectorId = (flows, connectorId) => {
  const listFlows = Object.values(flows);

  if (listFlows.length <= 0) return;

  const isConnector = (conn) => {
    return (conn.deviceFrom.connector.id === connectorId ||
      conn.deviceTo.connector.id === connectorId);
  }

  const getByConn = flow => {
    return flow.connections.find(isConnector);
  }

  const foundFlow = listFlows.find(getByConn);

  return foundFlow;
}

export const findFlowByConnectionId = (flows, connectionId) => {
  const listFlows = Object.values(flows);

  if (listFlows.length <= 0) return;

  const isConnection = conn => {
    return conn.id === connectionId;
  }

  const getByConn = flow => {
    return flow.connections.find(isConnection);
  }

  const foundFlow = listFlows.find(getByConn);

  return foundFlow;
}

export const findConnectionsBetweenConnector = (flows, connFrom, connTo) => {
  const listFlows = Object.values(flows);

  if (listFlows.length <= 0) return;

  const matchConnections = conn => {
    return (conn.deviceFrom.connector.id === connFrom.id &&
      conn.deviceTo.connector.id === connTo.id
    );
  }

  const getBetweenConn = flow => {
    return flow.connections.find(matchConnections);
  };

  const flow = listFlows.find(getBetweenConn);

  return flow;
}

const getQtdConnections = (flows, connector) => {
  if (flows.length === 0) return 0;

  const { id, type } = connector;
  const connectorType = type === 'exit' ? 'deviceFrom' : 'deviceTo';

  const flow = findFlowByConnectorId(flows, connector.id);

  if (!flow) return 0;

  const addConnection = (acc, connection) => {
    if (connection[`${connectorType}`].connector.id === id) {
      return acc + 1;
    }

    return acc;
  };

  const qtd = flow.connections.reduce(addConnection, 0);

  return qtd;
}

export const verifConnector = ({ flows, deviceFrom, deviceTo }) => {

  if (deviceFrom && !deviceTo) {
    const { name, category } = deviceFrom;


    const qtdFromOutputConnections = getQtdConnections(flows, deviceFrom.connector);

    const deviceFromIsInvalid = (
      deviceConnectorRules[name].acceptedConnections.includes('oneEntry') &&
      category === 'entry' &&
      qtdFromOutputConnections > 0
    );

    if (deviceFromIsInvalid) {
      return false;
    }

    return true;
  }

  const { name: fromName, connector: { type: fromConnCategory } } = deviceFrom;
  const { name: toName, connector: { type: toConnCategory } } = deviceTo;

  const qtdFromOutputConnections = getQtdConnections(flows, deviceFrom.connector);
  const qtdToInputConnections = getQtdConnections(flows, deviceTo.connector);

  const deviceFromIsInvalid = (
    deviceConnectorRules[fromName]?.acceptedConnections.includes('oneExit') &&
    fromConnCategory === 'exit' &&
    qtdFromOutputConnections > 0
  );

  const deviceToIsInvalid = (
    deviceConnectorRules[toName]?.acceptedConnections.includes('oneEntry') &&
    toConnCategory === 'entry' &&
    qtdToInputConnections > 0
  );

  const connectionBetweenFromAndToIsValid = deviceConnectorRules[fromName]?.connectsTo.some(item => ['all', toName].includes(item))
  const connectionBetweenToAndFromIsValid = deviceConnectorRules[toName].connectsFrom.some(item => ['all', fromName].includes(item));


  if (fromConnCategory === 'exit' && deviceConnectorRules === 'exit') return false;

  if (fromConnCategory === 'entry' && deviceConnectorRules === 'entry') return false;

  if (deviceFromIsInvalid || deviceToIsInvalid) return false;

  if (!connectionBetweenFromAndToIsValid) return false;

  if (!connectionBetweenToAndFromIsValid) return false;

  return true;
}

export const concatConnections = (conns1, conns2) => {

  const newConns = [...conns1];

  for (const connection of conns2) {
    if (!newConns.find(conn => conn.id === connection.id)) {
      newConns.push(connection);
    }
  }

  return newConns;

}
