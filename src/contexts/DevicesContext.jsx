import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 } from 'uuid';

import { calcPositionDevice } from '@/utils/devices-functions';
import { calcPositionConnector } from '@/utils/flow-functions';
import { findFlowByDeviceId } from "../utils/flow-functions";

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

    const deviceFlow = findFlowByDeviceId(flows, id);

    if (deviceFlow) {

      const { x: connPosX, y: connPosY } = calcPositionConnector(connRef.current);
      let lines = [];
      let connections = [];

      deviceFlow.connections.forEach(connection => {
        const { deviceFrom, deviceTo } = connection;
        const connectionLine = connectionLines.find(line => line.id === connection.idLine);

        let newLine = {};
        let newConnection = {}

        if (deviceFrom.id !== id && deviceTo.id !== id) {

          connections.push(connection);
          lines.push(connectionLine);

        } else {

          const { deviceType, connType } = deviceFrom.id === id ? {
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
              posX, posY,
              connector: {
                ...connection[`${deviceType}`].connector,
                x: connPosX,
                y: connPosY
              }
            },
          }

          newLine = {
            ...connectionLine,
            [`${connType}Pos`]: {
              x: connPosX,
              y: connPosY
            }
          }

          connections.push(newConnection);
          lines.push(newLine);
        }

      });

      updateLines(lines);
      updateFlows([{
        ...deviceFlow,
        connections
      }]);
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
