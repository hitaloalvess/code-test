import { createContext, useCallback, useEffect, useReducer } from "react";
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { findFlowsByDeviceId, verifConnector } from "@/utils/flow-functions";
import { useDevices } from '@/hooks/useDevices';
import { findConnectionsBetweenConnector, findFlowByConnectionId, findFlowByConnectorId } from "../utils/flow-functions";


const initialState = {
  flows: [],
  connectionLines: [],
  exec: {},
  flowTemp: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SAVE-FLOW':
      {
        const { deviceFrom, deviceTo } = action.payload.connection;

        const deviceCategoriesTwoConns = ['conditional', 'event'];

        const fromHasFlow = deviceCategoriesTwoConns.includes(deviceFrom.category) ?
          findFlowsByDeviceId(state.flows, deviceFrom.id) :
          findFlowByConnectorId(state.flows, deviceFrom.connector.id);

        const toHasFlow = deviceCategoriesTwoConns.includes(deviceTo.category) ?
          findFlowsByDeviceId(state.flows, deviceTo.id) :
          findFlowByConnectorId(state.flows, deviceTo.connector.id);

        const newDeviceFrom = { ...deviceFrom }
        // delete newDeviceFrom.defaultBehavior;

        const objConnection = {
          ...action.payload.connection,
          deviceFrom: {
            ...newDeviceFrom
          }
        }

        let newFlows;

        if (fromHasFlow && toHasFlow) {
          //device deviceTo and deviceFrom already has flows
          //group all connections in the deviceFrom stream

          const newFlow = {
            id: fromHasFlow.id,
            connections: [
              ...fromHasFlow.connections,
              ...toHasFlow.connections,
              objConnection
            ]
          }

          newFlows = state.flows.filter(flow => {
            return flow.id !== fromHasFlow.id && flow.id !== toHasFlow.id
          });

          newFlows.push(newFlow);

        }

        if ((fromHasFlow && !toHasFlow) || (toHasFlow && !fromHasFlow)) {
          //deviceFrom or to are part of a flow
          //bundle the new connection to the existing flow

          const previousConns = fromHasFlow ?
            [...fromHasFlow.connections] :
            [...toHasFlow.connections];

          const newFlow = {
            id: fromHasFlow ? fromHasFlow.id : toHasFlow.id,
            connections: [
              ...previousConns,
              objConnection
            ]
          }

          newFlows = state.flows.map(flow => {
            if (flow.id === newFlow.id) return newFlow;

            return flow;
          });

        }

        if (!fromHasFlow && !toHasFlow) {
          //create new flow if deviceFrom or to does not participate flow

          const newFlowKey = uuid();

          const newFlow = {
            id: newFlowKey,
            connections: [{ ...objConnection }]
          };

          newFlows = [
            ...state.flows,
            newFlow
          ];
        }

        return {
          ...state,
          flows: newFlows,
          exec: {
            deviceId: deviceFrom.id,
            funcDefault: deviceFrom.defaultBehavior
          }
        };

      }
    case 'UPDATE-FLOW':
      {
        const { newFlow } = action.payload;
        return {
          ...state,
          flows: state.flows.map(flow => {
            if (flow.id === newFlow.id) return newFlow;

            return flow;
          })
        }
      }
    case 'RECREATE-FLOW':
      {
        const { flowId, connectionId } = action.payload;

        const newFlows = state.flows.filter(flow => {
          return flow.id !== flowId
        })

        const flow = findFlowByConnectionId(state.flows, connectionId);

        const newConnections = flow.connections.filter(conn => {
          return conn.id !== connectionId
        })

        newConnections.forEach(conn => {
          action.payload.callback(
            {
              flows: newFlows,
              idConnection: conn.id,
              deviceFrom: conn.deviceFrom,
              deviceTo: conn.deviceTo,
              idLine: conn.idLine
            }
          )
        });



        return {
          ...state,
          flows: newFlows
        }
      }
    case 'DELETE-ALL-DEVICE-CONNS':
      {
        const { flowId, connections } = action.payload;

        const connsIds = connections.reduce((acc, conn) => [...acc, conn.id], []);
        const flow = state.flows.find(flow => flow.id === flowId);

        const newFlow = {
          ...flow,
          connections: flow.connections.filter(conn => !connsIds.includes(conn.id))
        }

        const newFlows = newFlow.connections.length <= 0 ?
          state.flows.filter(flow => flow.id !== newFlow.id) :
          state.flows.map(flow => {
            if (flow.id === newFlow.id) return newFlow;

            return flow;
          });

        return {
          ...state,
          flows: newFlows
        }
      }
    case 'CLEAR-EXEC':
      return {
        ...state,
        exec: {}
      }
    case 'ADD-FLOW-TEMP':
      {
        const { from, to, currentLine, connectorClicked } = action.payload;

        return {
          ...state,
          flowTemp: {
            from,
            to,
            currentLine,
            connectorClicked
          }
        }
      }
    case 'CLEAR-FLOW-TEMP':
      return {
        ...state,
        flowTemp: {
          from: null,
          to: null,
          currentLine: undefined,
          connectorClicked: false
        }
      }
    case 'CREATE-LINE':
      {
        const { id, fromPos, toPos } = action.payload;

        return {
          ...state,
          connectionLines: [
            ...state.connectionLines,
            {
              id, fromPos, toPos
            }
          ]
        }
      }
    case 'UPDATE-LINES':
      {
        const { lines } = action.payload;

        const newLines = state.connectionLines.map(connectionLine => {
          const newLine = lines.find(line => line.id === connectionLine.id);

          if (newLine) return newLine;

          return connectionLine;
        })

        return {
          ...state,
          connectionLines: newLines
        }
      }
    case 'DELETE-LINE':
      {
        const { id } = action.payload;

        const newLines = state.connectionLines.filter(line => line.id !== id)

        return {
          ...state,
          connectionLines: newLines,
          flowTemp: {
            from: null,
            to: null,
            currentLine: undefined,
            connectorClicked: false
          }
        }
      }
    default:
      return state;
  }
}

export const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const { devices } = useDevices();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!Object.hasOwn(state.exec, 'deviceId')) return;

    executeFlow({
      deviceId: state.exec.deviceId,
      fromBehaviorCallback: state.exec.funcDefault
    });

    dispatch({ type: 'CLEAR-EXEC' })

  }, [state.exec]);

  //LINES

  const createLine = ({ fromPos, toPos, }) => {
    const lineObj = {
      id: uuid(),
      fromPos,
      toPos
    }

    dispatch({
      type: 'CREATE-LINE',
      payload: {
        ...lineObj
      }
    })

    return lineObj;

  };

  const updateLines = (lines) => {
    // setConnectionLines(prevLines => {
    //   return prevLines.map(connectionLine => {
    //     const newLine = lines.find(line => line.id === connectionLine.id);

    //     if (newLine) return newLine;

    //     return connectionLine;
    //   })
    // })
    dispatch({
      type: 'UPDATE-LINES',
      payload: {
        lines
      }
    })
  };

  const deleteLine = ({ id }) => {

    // setConnectionLines(prevConnLines => {
    //   const newLines = prevConnLines.filter(line => line.id !== id)
    //   return newLines;
    // });

    // clearFlowTemp();

    dispatch({
      type: 'DELETE-LINE',
      payload: {
        id
      }
    })
  };

  //FLOWS

  const executeFlow = ({ flows, deviceId, fromBehaviorCallback }) => {
    const flowsCurrent = flows ? flows : state.flows;
    const selectedFlow = findFlowsByDeviceId(flowsCurrent, deviceId);

    if (!selectedFlow) return;

    const deviceConnections = selectedFlow.connections.filter(conn => {
      return conn.deviceFrom.id === deviceId;
    })

    deviceConnections.forEach(conn => {
      const valueFrom = fromBehaviorCallback();
      conn.deviceTo.defaultBehavior(valueFrom);
    })
  }

  const createFlow = ({
    devices: devicesParam
  }) => {
    const { from, to } = devicesParam;

    if (from.connector && !to?.connector && !state.flowTemp.connectorClicked) {
      const deviceFrom = devices.find(device => device.id === from.id);

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

      dispatch({
        type: 'ADD-FLOW-TEMP',
        payload: {
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
      });

      return;
    }

    if (!from || !to) return;

    //checks if the device is not wanting to connect with itself
    if (from.id === to.id) return;

    let deviceFrom = devices.find(device => device.id === from.id);
    let deviceTo = devices.find(device => device.id === to.id);

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
      let flag = { ...deviceFrom };
      deviceFrom = { ...deviceTo };
      deviceTo = { ...flag }
    }

    if (!verifConnector({ flows: [...state.flows], deviceFrom, deviceTo })) {
      deleteLine({
        id: state.flowTemp.currentLine.id
      });

      clearFlowTemp();
      return;
    }

    //Check if the connectors already connect
    const connsAlreadyConnect = findConnectionsBetweenConnector(
      state.flows, deviceFrom.connector, deviceTo.connector
    );


    if (connsAlreadyConnect) {
      clearFlowTemp();
      return;
    }

    const connection = {
      id: uuid(),
      deviceFrom: { ...deviceFrom },
      deviceTo: { ...deviceTo },
      idLine: state.flowTemp.currentLine.id,
    }

    updateLines([
      {
        id: state.flowTemp.currentLine.id,
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
    ]);

    dispatch({
      type: 'SAVE-FLOW',
      payload: {
        connection,
        callback: (params) => {
          executeFlow(params);
        }
      }
    })

  };

  const updateFlow = (newFlow) => {
    dispatch({ type: 'UPDATE-FLOW', payload: newFlow })
  };

  const recreateFlow = ({ flows, idConnection, deviceFrom, deviceTo, idLine }) => {
    if (!verifConnector({ flows, deviceFrom, deviceTo })) {
      deleteLine({
        id: state.flowTemp.currentLine.id
      });

      clearFlowTemp();
      return;
    }

    //Check if the connectors already connect
    const connsAlreadyConnect = findConnectionsBetweenConnector(
      flows, deviceFrom.connector, deviceTo.connector
    );


    if (connsAlreadyConnect) {
      deleteLine({
        id: idLine
      });

      clearFlowTemp();
      return;
    }

    const connection = {
      id: idConnection,
      deviceFrom: { ...deviceFrom },
      deviceTo: { ...deviceTo },
      idLine,
    }

    updateLines([
      {
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
    ]);

    dispatch({
      type: 'SAVE-FLOW',
      payload: {
        connection,
        callback: (params) => {
          console.log(params)
          executeFlow(params);
        }
      }
    })
  }

  const deleteConnection = ({ idConnection, idLine }) => {
    const { id: currentFlowId, connections: currentFlowConnections } = findFlowByConnectionId(state.flows, idConnection);
    const connectionDelete = currentFlowConnections.find(conn => conn.id === idConnection);

    deleteLine({ id: idLine });

    //redefine devices from the connection
    if (connectionDelete.deviceFrom.redefineBehavior) {
      connectionDelete.deviceFrom.redefineBehavior({
        idConnectionDelete: connectionDelete.id
      });
    }

    if (connectionDelete.deviceTo.redefineBehavior) {
      connectionDelete.deviceTo.redefineBehavior({
        idConnectionDelete: connectionDelete.id
      });
    }

    dispatch({
      type: 'RECREATE-FLOW',
      payload: {
        flowId: currentFlowId,
        connectionId: idConnection,
        callback: (params) => {
          recreateFlow({ ...params })
        }
      }
    });

  };

  const deleteDeviceConnections = useCallback((deviceId) => {
    const selectedFlow = findFlowsByDeviceId(state.flows, deviceId);

    if (!selectedFlow) return;

    const deviceConnections = selectedFlow.connections.filter(conn => {
      return conn.deviceFrom.id === deviceId || conn.deviceTo.id === deviceId;
    },)

    deviceConnections.forEach(conn => {
      deleteLine({ id: conn.idLine });

      //redefine devices from the connection
      if (conn.deviceFrom.redefineBehavior) {
        conn.deviceFrom.redefineBehavior({
          idConnectionDelete: conn.id
        });
      }

      if (conn.deviceTo.redefineBehavior) {
        conn.deviceTo.redefineBehavior({
          idConnectionDelete: conn.id
        });
      }
    })

    dispatch({
      type: 'DELETE-ALL-DEVICE-CONNS',
      payload: {
        connections: deviceConnections,
        flowId: selectedFlow.id
      }
    })

  }, [state.flows]);

  const clearFlowTemp = () => {
    dispatch({ type: 'CLEAR-FLOW-TEMP' });
  };

  return (
    <FlowContext.Provider
      value={{
        flows: state.flows,
        flowTemp: state.flowTemp,
        connectionLines: state.connectionLines,
        createFlow,
        deleteLine,
        deleteConnection,
        updateFlow,
        updateLines,
        executeFlow,
        deleteDeviceConnections,
        clearFlowTemp
      }}
    >
      {children}
    </FlowContext.Provider>
  )
};


FlowProvider.propTypes = {
  children: P.element.isRequired
}
