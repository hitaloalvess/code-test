import { v4 as uuid } from 'uuid';

import { verifConnector } from "@/utils/flow-functions";

import {
  findConnectionsBetweenConnector,
  findFlowsByDeviceId,
  findFlowByConnectorId,
  concatConnections,
  findFlowByConnectionId
} from "../utils/flow-functions";

const categoriesTwoConns = ['entry', 'conditional', 'event'];
export const createFlowsSlice = (set, get) => ({
  flows: {},
  flowTemp: {},

  saveFlow: ({ connection }) => {
    const { flows, executeFlow } = get();
    const { deviceFrom, deviceTo } = connection;

    const fromHasFlow = categoriesTwoConns.includes(deviceFrom.category) ?
      findFlowsByDeviceId(flows, deviceFrom.id) :
      findFlowByConnectorId(flows, deviceFrom.connector.id);

    const toHasFlow = categoriesTwoConns.includes(deviceTo.category) ?
      findFlowsByDeviceId(flows, deviceTo.id) :
      findFlowByConnectorId(flows, deviceTo.connector.id);

    let newFlows = {};

    //device deviceTo and deviceFrom already has flows
    //group all connections in the deviceFrom stream
    if (fromHasFlow && toHasFlow) {

      const groupConns = concatConnections(fromHasFlow.connections, toHasFlow.connections);
      const newFlow = {
        id: fromHasFlow.id,
        connections: [
          ...groupConns,
          connection
        ]
      }

      newFlows = {
        ...flows,
        [newFlow.id]: newFlow
      }

      if (fromHasFlow.id !== toHasFlow.id) {
        delete newFlows[toHasFlow.id];
      }

    }

    //deviceFrom or to are part of a flow
    //bundle the new connection to the existing flow
    if ((fromHasFlow && !toHasFlow) || (toHasFlow && !fromHasFlow)) {
      const previousConns = fromHasFlow ?
        [...fromHasFlow.connections] :
        [...toHasFlow.connections];

      const newFlow = {
        id: fromHasFlow ? fromHasFlow.id : toHasFlow.id,
        connections: [
          ...previousConns,
          connection
        ]
      };

      newFlows = {
        ...flows,
        [newFlow.id]: newFlow
      };

    }

    //create new flow if deviceFrom or to does not participate flow
    if (!fromHasFlow && !toHasFlow) {
      const newFlowKey = uuid();

      const newFlow = {
        id: newFlowKey,
        connections: [{ ...connection }]
      };

      newFlows = {
        ...flows,
        [newFlow.id]: newFlow
      }

    }

    //EXECUTE FLOW
    set({ flows: newFlows });

    executeFlow({ connectorId: deviceFrom.connector.id });
  },

  createFlow: ({ devices }) => {
    const { flows, flowTemp, createLine, deleteLine, updateLines, saveFlow } = get();
    const { from, to } = devices;

    if (from.connector && !to?.connector && !flowTemp.connectorClicked) {

      const deviceFrom = devices[`${from.id}`];

      const line = createLine({
        fromPos: {
          x: from.connector.x,
          y: from.connector.y
        },
        toPos: {
          x: from.connector.x,
          y: from.connector.y
        }
      });

      set({
        flowTemp: {
          from: {
            ...deviceFrom,
            connector: {
              ...from.connector
            },
          },
          to: null,
          currentLine: line,
          connectorClicked: true
        }
      })

      return;
    }

    if (!from || !to) return;

    //checks if the device is not wanting to connect with itself
    if (from.id === to.id) return;

    let deviceFrom = { ...devices[`${from.id}`] };
    let deviceTo = { ...devices[`${to.id}`] };

    delete deviceFrom.connectors;
    delete deviceTo.connectors;

    deviceFrom = {
      ...deviceFrom,
      ...from
    }

    deviceTo = {
      ...deviceTo,
      ...to
    }

    if (from.connector.type === 'entry') {
      //input device started stream creation
      [deviceFrom, deviceTo] = [deviceTo, deviceFrom];
    }

    //Check if the connectors already connect
    const connsAlreadyConnect = findConnectionsBetweenConnector(
      flows, deviceFrom.connector, deviceTo.connector
    );

    if (
      !verifConnector({ flows: flows, deviceFrom, deviceTo }) ||
      connsAlreadyConnect
    ) {
      deleteLine({ id: flowTemp.currentLine.id });

      set({ flowTemp: {} });
      return;
    }

    const line = flowTemp.currentLine ?
      flowTemp.currentLine :
      createLine({
        fromPos: {
          x: from.connector.x,
          y: from.connector.y
        },
        toPos: {
          x: from.connector.x,
          y: from.connector.y
        }
      });

    const connection = {
      id: uuid(),
      deviceFrom: { ...deviceFrom },
      deviceTo: { ...deviceTo },
      idLine: line.id,
    }

    updateLines({
      lineId: line.id,
      newData: {
        id: line.id,
        idConnection: connection.id,
        fromPos: {
          x: deviceFrom.connector.x,
          y: deviceFrom.connector.y
        },
        toPos: {
          x: deviceTo.connector.x,
          y: deviceTo.connector.y
        }
      }
    });

    saveFlow({ connection });
  },

  executeFlow: ({ connectorId }) => {
    const { flows, devices } = get();

    const selectedFlow = findFlowByConnectorId(flows, connectorId);

    if (!selectedFlow) return;

    const deviceConnections = selectedFlow.connections.filter(conn => {
      return conn.deviceFrom.connector.id === connectorId;
    })

    deviceConnections.forEach(conn => {
      const { id: fromId, connector: fromConnector } = conn.deviceFrom;

      if (devices[fromId].defaultSendBehavior) {
        //For components that have logic before passing values, ex: delay
        devices[fromId].defaultSendBehavior();

        return
      }

      //For components that only pass values
      const valueFrom = devices[fromId].value[fromConnector.name];

      devices[conn.deviceTo.id].defaultReceiveBehavior({
        value: valueFrom.current,
        max: valueFrom.max
      });
    })
  },

  updateFlow: (newFlow) => {
    const { id, connections } = newFlow;

    set((state) => ({
      flows: {
        ...state.flows,
        [id]: {
          id,
          connections
        }
      }
    }))
  },

  recreateConnection: ({ idConnection, deviceFrom, deviceTo, idLine }) => {
    const { flows, deleteLine, updateLines, saveFlow } = get();

    //Check if the connectors already connect
    const connsAlreadyConnect = findConnectionsBetweenConnector(
      flows, deviceFrom.connector, deviceTo.connector
    );

    if (
      connsAlreadyConnect ||
      !verifConnector({ flows, deviceFrom, deviceTo })
    ) {
      deleteLine({
        id: idLine
      });

      set({ flowTemp: {} });
      return;
    }

    const connection = {
      id: idConnection,
      deviceFrom: { ...deviceFrom },
      deviceTo: { ...deviceTo },
      idLine,
    }

    updateLines({
      lineId: idLine,
      newData: {
        id: idLine,
        idConnection: connection.id,
        fromPos: {
          x: deviceFrom.connector.x,
          y: deviceFrom.connector.y
        },
        toPos: {
          x: deviceTo.connector.x,
          y: deviceTo.connector.y
        }
      }
    });

    saveFlow({ connection });
  },

  recreateFlow: ({ flowId, connectionId }) => {

    const { flows, recreateConnection } = get();

    const newFlows = { ...flows };
    delete newFlows[flowId];

    set({ flows: newFlows });

    const flow = findFlowByConnectionId(flows, connectionId);

    const newConnections = flow.connections.filter(conn => {
      return conn.id !== connectionId;
    });

    newConnections.forEach(conn => {
      recreateConnection({
        idConnection: conn.id,
        deviceFrom: conn.deviceFrom,
        deviceTo: conn.deviceTo,
        idLine: conn.idLine
      });
    })

  },

  deleteConnection: ({ idConnection, idLine }) => {
    const { flows, devices, deleteLine, recreateFlow } = get();

    const { id: currentFlowId, connections: currentFlowConnections } = findFlowByConnectionId(flows, idConnection);
    const connectionDelete = currentFlowConnections.find(conn => conn.id === idConnection);

    deleteLine({ id: idLine });

    //redefine devices from the connection
    if (devices[connectionDelete.deviceFrom.id].redefineBehavior) {
      devices[connectionDelete.deviceFrom.id].redefineBehavior({
        idConnectionDelete: connectionDelete.id
      });
    }

    if (devices[connectionDelete.deviceTo.id].redefineBehavior) {
      devices[connectionDelete.deviceTo.id].redefineBehavior({
        idConnectionDelete: connectionDelete.id
      });
    }

    recreateFlow({ flowId: currentFlowId, connectionId: idConnection });
  },

  deleteDeviceConnections: ({ deviceId }) => {
    const { flows, devices, deleteLine } = get();

    const selectedFlow = findFlowsByDeviceId(flows, deviceId);


    if (!selectedFlow) return;

    const deviceConnections = selectedFlow.connections.filter(conn => {
      return conn.deviceFrom.id === deviceId || conn.deviceTo.id === deviceId;
    });

    deviceConnections.forEach(conn => {
      deleteLine({ id: conn.idLine });
      const deviceFrom = devices[conn.deviceFrom.id];
      const deviceTo = devices[conn.deviceTo.id];

      if (deviceFrom.redefineBehavior) {
        deviceFrom.redefineBehavior();
      }

      if (deviceTo.redefineBehavior) {
        deviceTo.redefineBehavior();
      }
    });

    const connsIds = deviceConnections.reduce((acc, connection) => [...acc, connection.id], []);

    const newFlow = {
      ...selectedFlow,
      connections: selectedFlow.connections.filter(connection => !connsIds.includes(connection.id)),
    }

    if (newFlow.connections.length <= 0) {
      const newFlows = { ...flows };
      delete newFlows[newFlow.id];

      set({ flows: newFlows });

      return;
    }

    const newFlows = {
      ...flows,
      [newFlow.id]: newFlow,
    }

    set({ flows: newFlows });
  },

  repositionConnections: ({ device, connector }) => {
    const { flows, lines, updateLines, updateFlow } = get();

    const { id, posX, posY } = connector;

    const selectedFlow = findFlowByConnectorId(flows, id);

    if (!selectedFlow) return;

    let newLines = [];
    let connections = [];

    const connectorConnections = selectedFlow.connections.filter((connection) => {
      if (connection.deviceFrom.connector.id === id ||
        connection.deviceTo.connector.id === id
      ) {
        return true;
      }

      connections.push(connection);
      return false;

    });

    connectorConnections.forEach(connection => {
      const { deviceFrom, deviceTo } = connection;
      const connectionLine = lines.find(line => line.id === connection.idLine);

      let newConnection = {}

      if (deviceFrom.id !== device.id && deviceTo.id !== device.id) {

        connections.push(connection);
        newLines.push(connectionLine);

      } else {

        const { deviceType, connType } = deviceFrom.id === device.id ? {
          deviceType: 'deviceFrom',
          connType: 'from'
        } : {
          deviceType: 'deviceTo',
          connType: 'to'
        };

        newConnection = {
          ...connection,
          [`${deviceType}`]: {
            ...connection[`${deviceType}`],
            posX: device.posX,
            posY: device.posY,
            connector: {
              ...connection[`${deviceType}`].connector,
              x: posX,
              y: posY
            }
          },
        }

        updateLines({
          lineId: connectionLine.id,
          newData: {
            [`${connType}Pos`]: {
              x: posX,
              y: posY
            }
          }

        });

        connections.push(newConnection);
      }

      updateFlow({
        ...selectedFlow,
        connections
      })

    });
  },

  updateDeviceValueInFlow: ({ connectorId, newValue }) => {
    const { flows } = get();

    if (Object.keys(flows).length === 0) return;

    const selectedFlow = findFlowByConnectorId(flows, connectorId);

    if (!selectedFlow) return;

    const newConnections = selectedFlow.connections.map(conn => {
      if (conn.deviceFrom.connector.id === connectorId) {
        return {
          ...conn,
          deviceFrom: {
            ...conn.deviceFrom,
            value: newValue
          }
        }
      }

      if (conn.deviceTo.connector.id === connectorId) {
        return {
          ...conn,
          deviceTo: {
            ...conn.deviceTo,
            value: newValue
          }
        }
      }

      return conn;
    });

    set((state) => ({
      flows: {
        ...state.flows,
        [selectedFlow.id]: {
          ...state.flows[selectedFlow.id],
          connections: newConnections
        }
      }
    }));

  },

  clearFlowTemp: () => set({ flowTemp: {} });
})
