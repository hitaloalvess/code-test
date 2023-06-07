import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { findFlowsByDeviceId, verifConnector } from "@/utils/flow-functions";
import { useDevices } from '@/hooks/useDevices';
import { findConnectionsBetweenConnector, findFlowByConnectionId, findFlowByConnectorId } from "../utils/flow-functions";

export const FlowContext = createContext();

export const FlowProvider = ({ children }) => {
  const { devices } = useDevices();
  const [flows, setFlows] = useState([]);
  const [flowTemp, setFlowTemp] = useState({
    from: null,
    to: null,
    currentLine: null,
    connectorClicked: false
  });

  //LINES
  const [connectionLines, setConnectionLines] = useState([]);

  const createLine = ({ fromPos, toPos, }) => {
    const lineObj = {
      id: uuid(),
      fromPos,
      toPos
    }

    setConnectionLines(prev => [
      ...prev,
      lineObj
    ]);

    return lineObj;

  };

  const updateLines = (lines) => {
    setConnectionLines(prevLines => {
      return prevLines.map(connectionLine => {
        const newLine = lines.find(line => line.id === connectionLine.id);

        if (newLine) return newLine;

        return connectionLine;
      })
    })

  };

  const deleteLine = useCallback(({ id }) => {

    setConnectionLines(prevConnLines => {
      const newLines = prevConnLines.filter(line => line.id !== id)
      return newLines;
    });

    clearFlowTemp();
  }, [connectionLines]);

  //FLOWS

  const executeFlow = (flows, deviceId, fromBehaviorCallback) => {
    if (flows.length <= 0) return;

    const selectedFlows = findFlowsByDeviceId(flows, deviceId);

    if (!selectedFlows) return;

    selectedFlows.forEach(flow => {
      const deviceConnections = flow.connections.filter(conn => {
        return conn.deviceFrom.id === deviceId;
      })

      deviceConnections.forEach(conn => {
        const valueFrom = fromBehaviorCallback();
        conn.deviceTo.defaultBehavior(valueFrom);
      })
    })
  }

  const saveFlow = useCallback((connection) => {
    const { deviceFrom, deviceTo } = connection;

    const deviceCategoriesTwoConns = ['conditional', 'event'];

    const fromHasFlow = deviceCategoriesTwoConns.includes(deviceFrom.category) ?
      findFlowsByDeviceId(flows, deviceFrom.id)[0] :
      findFlowByConnectorId(flows, deviceFrom.connector.id);

    const toHasFlow = deviceCategoriesTwoConns.includes(deviceTo.category) ?
      findFlowsByDeviceId(flows, deviceTo.id)[0] :
      findFlowByConnectorId(flows, deviceTo.connector.id);

    let newFlows;

    const newDeviceFrom = { ...deviceFrom }
    delete newDeviceFrom.defaultBehavior;

    const objConnection = {
      ...connection,
      deviceFrom: {
        ...newDeviceFrom
      }
    }

    if ((fromHasFlow && !toHasFlow) || (toHasFlow && !fromHasFlow)) {
      //from or to are part of a flow
      //bundle the new connection to the existing flow
      const flowKey = fromHasFlow ? fromHasFlow.id : toHasFlow.id;

      const newFlow = flows.find(flow => flow.id === flowKey);
      newFlow.connections.push(objConnection);

      newFlows = flows.filter(flow => {
        if (flow.id === newFlow.id) return newFlow;

        return flow;
      });

    }

    if (fromHasFlow && toHasFlow) {
      //device to and from already has flows
      //group all connections in the from stream

      const newFlow = { ...fromHasFlow }
      toHasFlow.connections.forEach(connection => {
        newFlow.connections.push(connection);
      });
      newFlow.connections.push(objConnection);

      newFlows = flows.filter(flow => {
        return flow.id !== fromHasFlow.id && flow.id !== toHasFlow.id
      });
      newFlows.push(newFlow);

    }

    if (!fromHasFlow && !toHasFlow) {
      //create new flow if from or to does not participate flow

      const newFlowKey = uuid();

      const flow = {
        id: newFlowKey,
        connections: [{ ...objConnection }]
      }

      newFlows = [
        ...flows,
        flow
      ]

    }

    setFlows(newFlows);

    executeFlow(newFlows, deviceFrom.id, deviceFrom.defaultBehavior);

  }, [flows]);

  const createFlow = useCallback(({
    devices: devicesParam
  }) => {
    const { from, to } = devicesParam;

    if (from.connector && !to?.connector && !flowTemp.connectorClicked) {
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

      setFlowTemp({
        from: {
          ...deviceFrom,
          connector: {
            ...from.connector
          },
        },
        to: null,
        currentLine: line,
        connectorClicked: true
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

    if (!verifConnector({ flows: [...flows], deviceFrom, deviceTo })) {
      deleteLine({
        id: flowTemp.currentLine.id
      });

      clearFlowTemp();
      return;
    }

    //Check if the connectors already connect
    const connsAlreadyConnect = findConnectionsBetweenConnector(
      flows, deviceFrom.connector, deviceTo.connector
    );

    if (connsAlreadyConnect) {
      clearFlowTemp();
      return;
    }

    const connection = {
      id: uuid(),
      deviceFrom: { ...deviceFrom },
      deviceTo: { ...deviceTo },
      idLine: flowTemp.currentLine.id,
    }

    updateLines([
      {
        id: flowTemp.currentLine.id,
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

    saveFlow(connection);

  }, [devices, flowTemp, createLine, updateLines, deleteLine, saveFlow]);

  const updateFlow = (newFlow) => {
    setFlows(prevFlows => {
      return prevFlows.map(flow => {

        if (flow.id === newFlow.id) return newFlow;

        return flow;
      });
    });
  };

  const deleteConnection = useCallback(({ idConnection, idLine }) => {
    const { id: currentFlowId, connections: currentFlowConnections } = findFlowByConnectionId(flows, idConnection);
    const connectionDelete = currentFlowConnections.find(conn => conn.id === idConnection);

    const flowRemoveConnection = (flow, currentFlowId) => {
      const { id, connections } = flow;

      if (id !== currentFlowId) return flow;


      const newConnections = connections.filter(conn => {
        return conn.id !== idConnection;
      })

      return {
        ...flow,
        connections: newConnections
      };

    };

    deleteLine({ id: idLine });


    setFlows(prevFlows => {
      const flow = prevFlows.find(flow => flow.id === currentFlowId);

      if (flow.connections.length <= 1) {
        return prevFlows.filter(flow => {
          return flow.id !== currentFlowId;
        })
      }

      return prevFlows.map(flow => flowRemoveConnection(flow, currentFlowId))
    });

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

  }, [flows, deleteLine]);

  const deleteDeviceConnections = useCallback((deviceId) => {
    const selectedFlows = findFlowsByDeviceId(flows, deviceId);

    if (!selectedFlows) return;

    selectedFlows.forEach(flow => {
      const deviceConnections = flow.connections.filter(conn => {
        return conn.deviceFrom.id === deviceId || conn.deviceTo.id === deviceId;
      });

      deviceConnections.forEach(({ id, idLine }) => {

        deleteConnection({
          idConnection: id,
          idLine
        });
      })
    })

  }, [flows, deleteConnection]);

  const clearFlowTemp = () => {
    setFlowTemp({
      from: null,
      to: null,
      currentLine: undefined,
      connectorClicked: false
    });
  };

  return (
    <FlowContext.Provider
      value={{
        flows,
        flowTemp,
        connectionLines,
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
