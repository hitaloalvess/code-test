import { deviceConnectorRules } from '@/data/devices.js';
export const calcPositionConnector = (connector) => {
  const {
    left: connectorLeft,
    right: connectorRight,
    top: connectorTop,
    bottom: connectorBottom
  } = connector.getBoundingClientRect();

  const x = ((connectorLeft + connectorRight) / 2);
  const y = ((connectorTop + connectorBottom) / 2);

  return {
    x,
    y,
    connectorLeft,
    connectorRight,
    connectorTop,
    connectorBottom
  }
}

const getQtdConnections = (flows, connector) => {
  if (flows.length === 0) return 0;

  const { id, type } = connector;
  const connectorType = type === 'exit' ? 'deviceFrom' : 'deviceTo';

  const flow = flows.find(flow => {
    return flow.connections.find(connection => {
      return connection[`${connectorType}`].connector.id === id;
    })
  });

  if (!flow) return 0;

  const qtd = flow.connections.reduce((acc, connection) => {
    if (connection[`${connectorType}`].connector.id === id) {
      return acc + 1;
    }

    return acc;
  }, 0)

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

  const { name: fromName, category: fromCategory } = deviceFrom;
  const { name: toName, category: toCategory } = deviceTo;

  const qtdFromOutputConnections = getQtdConnections(flows, deviceFrom.connector);
  const qtdToInputConnections = getQtdConnections(flows, deviceTo.connector);

  const deviceFromIsInvalid = (
    deviceConnectorRules[fromName].acceptedConnections.includes('oneExit') &&
    fromCategory === 'entry' &&
    qtdFromOutputConnections > 0
  );

  const deviceToIsInvalid = (
    deviceConnectorRules[toName].acceptedConnections.includes('oneEntry') &&
    toCategory === 'exit' &&
    qtdToInputConnections > 0
  );

  const connectionBetweenFromAndToIsValid = deviceConnectorRules[fromName]?.connectsTo.some(item => ['all', toName].includes(item))
  const connectionBetweenToAndFromIsValid = deviceConnectorRules[toName].connectsFrom.some(item => ['all', fromName].includes(item));


  if (fromCategory === 'exit' && toCategory === 'exit') return false;

  if (fromCategory === 'entry' && toCategory === 'entry') return false;

  if (deviceFromIsInvalid || deviceToIsInvalid) return false;

  if (!connectionBetweenFromAndToIsValid) return false;

  if (!connectionBetweenToAndFromIsValid) return false;

  return true;
}

export const findFlowByDeviceId = (flows, deviceId) => {
  const foundFlow = flows.find(flow => {
    return flow.connections.find(conn => {
      return (conn.deviceFrom.id === deviceId ||
        conn.deviceTo.id === deviceId);
    });
  });

  return foundFlow;
}

export const findFlowByConnectionId = (flows, connectionId) => {
  const foundFlow = flows.find(flow => {
    return flow.connections.find(conn => {
      return conn.id === connectionId;
    });
  });

  return foundFlow;
}

export const findConnectionsBetweenConnector = (flows, connFrom, connTo) => {
  const flow = flows.find(flow => {
    return flow.connections.find(conn => {
      return (conn.deviceFrom.connector.id === connFrom.id &&
        conn.deviceTo.connector.id === connTo.id
      );
    });
  });

  return flow;
}
