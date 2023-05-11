import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 } from 'uuid';

import { calcPositionDevice } from '@/utils/devices-functions';
import { calcPositionConnector } from '@/utils/flow-functions';

export const DevicesContext = createContext();


export const DevicesProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);

  const addDevice = (item, monitor) => {

    const { width, height } = item.draggedDevice.getBoundingClientRect();
    const { x, y } = monitor.getClientOffset();
    const [posX, posY] = calcPositionDevice({ x, y, width, height });


    setDevices((devices) => [...devices, {
      ...item,
      id: v4(),
      posX,
      posY
    }]);

    return;

  }

  const repositionDevice = useCallback((data) => {
    const {
      device,
      screen,
      flows,
      connectionLines,
      updateLines,
      updateFlows
    } = data;
    const { id, draggedDevice, connRef } = device;

    const { width, height } = draggedDevice.getBoundingClientRect();
    const { x, y } = screen.getClientOffset();
    const [posX, posY] = calcPositionDevice({ x, y, width, height });

    const newListDevices = devices.map(device => {
      if (device.id === id) {
        return {
          ...device,
          posX,
          posY
        }
      }
      return device
    });


    //Verificar se o dispositivo possui fluxos
    const deviceFlows = flows.filter(flow => {
      return flow.deviceFrom.id === id || flow.deviceTo.id === id;
    });


    if (deviceFlows.length > 0) {
      const { x: connPosX, y: connPosY } = calcPositionConnector(connRef.current);

      //Update device placement in your flows
      let lines = [];
      let flows = [];

      deviceFlows.forEach(flow => {

        const connectionLine = connectionLines.find(line => line.id === flow.idLine);
        let newLine = {};
        let newFlow = {}

        if (flow.deviceFrom.id === id) {

          newFlow = {
            ...flow,
            deviceFrom: {
              ...flow.deviceFrom,
              posX, posY
            },
            connectors: {
              from: {
                x: connPosX,
                y: connPosY
              },
              to: { ...flow.connectors.to }
            }
          }

          newLine = {
            id: flow.idLine,
            fromPos: {
              x: connPosX,
              y: connPosY
            },
            toPos: {
              ...connectionLine.toPos
            }
          };

          flows.push(newFlow);
          lines.push(newLine);

        } else {

          newFlow = {
            ...flow,
            deviceTo: {
              ...flow.deviceTo,
              posX, posY
            },
            connectors: {
              from: {
                ...flow.connectors.from
              },
              to: {
                x: connPosX,
                y: connPosY
              }
            }
          }

          newLine = {
            id: flow.idLine,
            fromPos: {
              ...connectionLine.fromPos
            },
            toPos: {
              x: connPosX,
              y: connPosY
            }
          }

          flows.push(newFlow);
          lines.push(newLine);
        }

      });

      updateLines(lines);
      updateFlows(flows);
    }

    setDevices(newListDevices);

  }, [devices]);

  const deleteDevice = useCallback((id) => {
    const newDevices = devices.filter(device => {
      return device.id !== id
    });

    setDevices(newDevices);
  }, [devices]);

  return (
    <DevicesContext.Provider
      value={{ devices, addDevice, deleteDevice, repositionDevice }}
    >
      {children}
    </DevicesContext.Provider>
  )
}

DevicesProvider.propTypes = {
  children: P.element.isRequired
}
