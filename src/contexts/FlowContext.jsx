import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { findFlowByDeviceId, verifConnector } from "@/utils/flow-functions";
import { useDevices } from '@/hooks/useDevices';
import { findFlowByConnectionId } from "../utils/flow-functions";

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

  const createLine = useCallback(({ fromPos, toPos, }) => {
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

  }, []);

  const updateLines = useCallback((lines) => {
    const newLines = connectionLines.map(connectionLine => {
      const newLine = lines.find(line => line.id === connectionLine.id);

      if (newLine) return newLine;

      return connectionLine;
    })

    setConnectionLines(newLines);
  }, [connectionLines]);

  const deleteLine = useCallback(({ id }) => {
    const newLines = connectionLines.filter(line => line.id !== id);

    setConnectionLines(newLines);

    clearFlowTemp();
  }, [connectionLines]);

  //FLOWS

  const executeFlow = (flows, deviceId) => {
    if (flows.length <= 0) return;

    const deviceFlow = findFlowByDeviceId(flows, deviceId);

    if (!deviceFlow) return;

    const deviceConnections = deviceFlow.connections.filter(conn => {
      return conn.deviceFrom.id === deviceId;
    })

    deviceConnections.forEach(conn => {
      const valueFrom = conn.deviceFrom.defaultBehavior();
      conn.deviceTo.defaultBehavior(valueFrom);
    })
  }

  const saveFlow = useCallback((connection) => {
    const { deviceFrom, deviceTo } = connection;

    const fromHasFlow = findFlowByDeviceId(flows, deviceFrom.id);
    const toHasFlow = findFlowByDeviceId(flows, deviceTo.id);

    let newFlows;

    if ((fromHasFlow && !toHasFlow) || (toHasFlow && !fromHasFlow)) {
      //from or to are part of a flow
      //bundle the new connection to the existing flow
      const flowKey = fromHasFlow ? fromHasFlow.id : toHasFlow.id;

      const newFlow = flows.find(flow => flow.id === flowKey);
      newFlow.connections.push(connection);

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
      newFlow.connections.push(connection);

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
        connections: [{ ...connection }]
      }

      newFlows = [
        ...flows,
        flow
      ]

    }

    setFlows(newFlows);

    executeFlow(newFlows, deviceFrom.id);

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

    //ARRUMAR AQUI -> VALIDAR SE O COMPONENTE NAO ESTA QUERENDO CRIAR UM FLUXO COM ELE MESMO
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

    if (!verifConnector({ deviceFrom, deviceTo })) {
      deleteLine({
        id: flowTemp.currentLine.id
      })

      clearFlowTemp();
      return false;
    }

    //Verificar se os conectores já conectam
    /// ARRUMAR AQUI


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

    //Executar o flow de forma inicial

  }, [devices, flowTemp, createLine, updateLines, deleteLine, saveFlow]);

  const updateFlows = useCallback((newFlows) => {
    const newFlowsList = flows.map(flow => {
      const newFlow = newFlows.find(currentFlow => currentFlow.id === flow.id);
      if (flow.id === newFlow?.id) return newFlow;

      return flow;
    });

    setFlows(newFlowsList);
  }, [flows]);

  const deleteConnection = useCallback(({ idConnection, idLine }) => {
    const currentFlow = findFlowByConnectionId(flows, idConnection);

    deleteLine({ id: idLine });

    const deleteFlow = (flow) => flow.id !== currentFlow.id;
    const flowRemoveConnection = (flow) => {
      if (flow.id === currentFlow.id) {
        const newConnections = flow.connections.filter(conn => {
          return conn.id !== idConnection
        });

        return {
          ...flow,
          connections: newConnections
        };
      }

      return flow;
    };
    const newFlows = currentFlow.connections.length <= 1 ?
      flows.filter(deleteFlow) :
      flows.map(flowRemoveConnection)

    setFlows(newFlows);

    //ARRUMAR AQUI -> Redefine behavior device
  }, [flows, deleteLine]);


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
        updateFlows,
        updateLines,
        executeFlow
      }}
    >
      {children}
    </FlowContext.Provider>
  )
};


FlowProvider.propTypes = {
  children: P.element.isRequired
}
