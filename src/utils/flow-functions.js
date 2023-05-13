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

export const verifConnector = ({ deviceFrom, deviceTo }) => {
  //Obj device
  // category: "entry"
  // draggedDevice: div._deviceItemContent_1c24a_9
  // id: "6f86f666-3d21-49b0-b476-24fadbdc245e"
  // imgSrc: "/src/assets/images/devices/entry/ldr.svg"
  // name: "ldr"
  // posX: 300
  // posY: 166
  // type: "virtual"

  if (deviceFrom && !deviceTo) {
    const { name, category } = deviceFrom;
    // const qtdInputConnections = 0;
    const qtdOutputConnections = 0;// CORRIGIR --> VOLTAR AQUI E ARRUMAR A GERACAO DE QUANTIDADE DE CONEXOES

    const deviceFromIsInvalid = (
      deviceConnectorRules[name].acceptedConnections.includes('oneEntry') &&
      category === 'entry' &&
      qtdOutputConnections > 0
    );

    if (deviceFromIsInvalid) {
      return false;
    }

    return true;
  }

  const { name: fromName, category: fromCategory } = deviceFrom;
  const { name: toName, category: toCategory } = deviceTo;

  const qtdOutputFromConnections = 0;
  const qtdToInputConnections = 0;

  const deviceFromIsInvalid = (
    deviceConnectorRules[fromName].acceptedConnections.includes('oneEntry') &&
    fromCategory === 'entry' &&
    qtdOutputFromConnections > 0
  );

  const deviceToIsInvalid = (
    deviceConnectorRules[toName].acceptedConnections.includes('oneExit') &&
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
