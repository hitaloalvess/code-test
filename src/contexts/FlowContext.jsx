import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 as uuid } from 'uuid';

import { findFlowByDeviceId, verifConnector } from "@/utils/flow-functions";
import { useDevices } from '@/hooks/useDevices';

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

  const saveFlow = useCallback((connection) => {
    const { deviceFrom, deviceTo } = connection;



    const fromHasFlow = findFlowByDeviceId(flows, deviceFrom.id);
    const toHasFlow = findFlowByDeviceId(flows, deviceTo.id);

    //device to and from already has flows ()
    if (fromHasFlow && toHasFlow) {
      //group all connections in the from stream
      const newFlow = { ...fromHasFlow }
      toHasFlow.connections.forEach(connection => {
        newFlow.connections.push(connection);
      });
      newFlow.connections.push(connection);

      const newFlows = flows.filter(flow => {
        return flow.id !== fromHasFlow.id && flow.id !== toHasFlow.id
      });
      newFlows.push(newFlow);

      setFlows(newFlows);

      return;
    }

    //from or to are part of a flow
    if (fromHasFlow || toHasFlow) {
      //bundle the new connection to the existing flow
      const flowKey = fromHasFlow ? fromHasFlow.id : toHasFlow.id;

      const newFlow = flows.find(flow => flow.id === flowKey);
      newFlow.connections.push(connection);

      const newFlows = flows.filter(flow => {
        if (flow.id === newFlow.id) return newFlow;

        return flow;
      });

      setFlows(newFlows);

      return newFlow;
    }

    //create new flow if from or to does not participate flow
    const newFlowKey = uuid();

    const flow = {
      id: newFlowKey,
      connections: [{ ...connection }]
    }

    setFlows(prev => [
      ...prev,
      flow
    ])
  }, [flows]);

  const createFlow = useCallback(({
    idDevices,
    connectors,
  }) => {

    if (connectors.from && !connectors.to && !flowTemp.connectorClicked) {
      const deviceFrom = devices.find(device => device.id === idDevices.from);

      const line = createLine({
        fromPos: {
          x: connectors.from.x,
          y: connectors.from.y
        },
        toPos: {
          x: connectors.from.x,
          y: connectors.from.y
        }
      });

      setFlowTemp({
        from: {
          ...deviceFrom,
          connectorPos: {
            ...connectors.from
          },
        },
        to: null,
        currentLine: line,
        connectorClicked: true
      });

      return;
    }

    if (idDevices.from === idDevices.to) return;

    let { from: connectorFrom, to: connectorTo } = connectors;

    let deviceFrom = devices.find(device => device.id === idDevices.from);
    let deviceTo = devices.find(device => device.id === idDevices.to);

    if (connectorFrom.type === 'entry') {
      //input device started stream creation
      let flag = { ...deviceFrom };
      deviceFrom = { ...deviceTo };
      deviceTo = { ...flag }

      flag = { ...connectorFrom }
      connectorFrom = { ...connectorTo }
      connectorTo = { ...flag }
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

    updateLines([
      {
        id: flowTemp.currentLine.id,
        fromPos: {
          x: connectorFrom.x,
          y: connectorFrom.y
        },
        toPos: {
          x: connectorTo.x,
          y: connectorTo.y
        }
      }
    ]);

    const connFlow = {
      id: uuid(),
      deviceFrom: { ...deviceFrom },
      deviceTo: { ...deviceTo },
      idLine: flowTemp.currentLine.id,
      connectors: {
        from: { ...connectorFrom },
        to: { ...connectorTo }
      }
    }

    //save flow

    saveFlow(connFlow);
    // setFlows(prev => [
    //   ...prev,
    //   flow
    // ]);

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
        // updateLines,
        deleteLine,
        updateFlows,
        updateLines
      }}
    >
      {children}
    </FlowContext.Provider>
  )
};


FlowProvider.propTypes = {
  children: P.element.isRequired
}
