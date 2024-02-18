import { v4 as uuid } from 'uuid';

import { verifConnector } from "@/utils/flow-functions";

import {
  findConnectionsBetweenConnector,
  findFlowsByDeviceId,
  findFlowByConnectorId,
  concatConnections,
  findFlowByConnectionId
} from "@/utils/flow-functions";

export const createFlowsSlice = (set, get) => ({
  flows: {},
  flowTemp: {},

  saveFlow: ({ connection }) => {
    const { flows, executeFlow } = get();
    const { deviceFrom, deviceTo } = connection;

    const fromHasFlow = findFlowsByDeviceId(flows, deviceFrom.id);

    const toHasFlow = findFlowsByDeviceId(flows, deviceTo.id);


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
        ],
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

    const {
      flows,
      flowTemp,
      createLine,
      updateLines,
      saveFlow,
      devices: deviceList,
      clearFlowTemp,
      deleteLine
    } = get();

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

    if (from.id === to.id) return;

    let deviceFrom = { ...deviceList[`${from.id}`] };
    let deviceTo = { ...deviceList[`${to.id}`] };

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


    if (from?.connector?.type === 'entry') {
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
      deleteLine(flowTemp.currentLine?.id);

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
          x: to.connector.x,
          y: to.connector.y
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

    clearFlowTemp();

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
      const { id: toId, connector: toConnector } = conn.deviceTo;

      const currentFromConnectorData = devices[fromId].connectors[fromConnector.name];
      const currentToConnectorData = devices[toId].connectors[toConnector.name];

      if (currentFromConnectorData.defaultSendBehavior) {
        //For components that have logic before passing values, ex: delay
        currentFromConnectorData.defaultSendBehavior();

        return
      }

      //For components that only pass values
      const valueFrom = devices[fromId].value[fromConnector.name];

      if (currentToConnectorData.defaultReceiveBehavior) {

        currentToConnectorData.defaultReceiveBehavior({
          value: valueFrom.current,
          max: valueFrom.max
        });

      }
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
      deleteLine(idLine);

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

    deleteLine(idLine);

    const { deviceFrom, deviceTo } = connectionDelete;
    const deviceFromConnector = devices[deviceFrom.id].connectors[deviceFrom.connector.name];
    const deviceToConnector = devices[deviceTo.id].connectors[deviceTo.connector.name];

    //redefine devices from the connection
    if (deviceFromConnector.redefineBehavior) {
      deviceFromConnector.redefineBehavior();
    }

    if (deviceToConnector.redefineBehavior) {
      deviceToConnector.redefineBehavior();
    }

    recreateFlow({ flowId: currentFlowId, connectionId: idConnection });
  },

  deleteDeviceConnections: ({ deviceId }) => {
    const { flows, devices, deleteLine, deleteDevice } = get();

    const selectedFlow = findFlowsByDeviceId(flows, deviceId);


    if (!selectedFlow) {
      deleteDevice(deviceId);

      return;
    }

    const deviceConnections = selectedFlow.connections.filter(conn => {
      return conn.deviceFrom.id === deviceId || conn.deviceTo.id === deviceId;
    });

    deviceConnections.forEach(conn => {
      deleteLine(conn.idLine);
      const fromConnector = devices[conn.deviceFrom.id].connectors[conn.deviceFrom.connector.name];
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];

      if (fromConnector.redefineBehavior) {
        fromConnector.redefineBehavior();
      }

      if (toConnector.redefineBehavior) {
        toConnector.redefineBehavior();
      }
    });

    const connsIds = deviceConnections.reduce((acc, connection) => [...acc, connection.id], []);

    const newFlow = {
      ...selectedFlow,
      connections: selectedFlow.connections.filter(connection => !connsIds.includes(connection.id)),
    }

    deleteDevice(deviceId);

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
      const connectionLine = Object.values(lines).find(line => line.id === connection.idLine);

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

  clearFlowTemp: () => set({ flowTemp: {} }),

  getFlows: () => {
    const { flows } = get();

    return flows;
  },

  loadFlows: ({ flows }) => {

    const {
      flows: currentFlows,
      devices,
      createLine,
      executeFlow
    } = get();

    for (const flow of flows) {

      for (const connection of flow.connections) {
        const { deviceFrom, deviceTo } = connection;

        const from = {
          ...devices[deviceFrom.id],
          connector: {
            ...devices[deviceFrom.id].connectors[deviceFrom.connector.name]
          }
        }

        const to = {
          ...devices[deviceTo.id],
          connector: {
            ...devices[deviceTo.id].connectors[deviceTo.connector.name]
          }
        }

        delete from.connectors;
        delete to.connectors;

        createLine({
          id: connection.idLine,
          idConnection: connection.id,
          fromPos: {
            x: deviceFrom.connector.x,
            y: deviceFrom.connector.y
          },
          toPos: {
            x: deviceTo.connector.x,
            y: deviceTo.connector.y
          }
        });

        const newFlows = {
          ...currentFlows,
          [flow.id]: {
            id: flow.id,
            connections: currentFlows[flow.id]?.connections.length > 0 ?
              [...currentFlows[flow.id].connections, connection] :
              [connection]
          }
        }

        set({ flows: newFlows });
        executeFlow({ connectorId: deviceFrom.connector.id });
      }

    }
  }
})
