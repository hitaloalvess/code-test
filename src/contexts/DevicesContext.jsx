import { createContext, useCallback, useState } from "react";
import P from 'prop-types';
import { v4 } from 'uuid';

import { calcPositionDevice } from '@/utils/devices-functions';
import { findFlowByConnectorId } from "../utils/flow-functions";

export const DevicesContext = createContext();

export const DevicesProvider = ({ children }) => {
  const [devices, setDevices] = useState({});
  const [deviceScale, setDeviceScale] = useState(1);

  const addDevice = (item, monitor) => {
    const { width, height } = item.draggedDevice.getBoundingClientRect();
    const { x, y } = monitor.getClientOffset();
    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: item.containerRef
    });

    delete item.draggedDevice;

    const deviceId = v4();

    setDevices(prevDevices => {

      return {
        ...prevDevices,
        [`${deviceId}`]: {
          ...item,
          id: deviceId,
          posX,
          posY
        }
      }
    });

    return;

  }

  const repositionDevice = useCallback((data) => {

    const {
      device,
      screen,
    } = data;

    const { id, deviceRef } = device;

    const { width, height } = deviceRef.current.getBoundingClientRect();

    const { x, y } = screen.getClientOffset();
    const [posX, posY] = calcPositionDevice({
      x,
      y,
      width,
      height,
      containerRef: device.containerRef
    });

    setDevices(prevDevices => {
      return {
        ...prevDevices,
        [`${id}`]: {
          ...prevDevices[`${id}`],
          posX,
          posY,
          deviceRef
        }
      }
    });

  }, [devices]);

  const repositionConnections = (data) => {


    const {
      device,
      connector,
      flows,
      connectionLines,
      updateLines,
      updateFlow
    } = data;

    const { id, posX, posY } = connector;

    const selectedFlow = findFlowByConnectorId(flows, id);

    if (!selectedFlow) return;

    let lines = [];
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
      const connectionLine = connectionLines.find(line => line.id === connection.idLine);

      let newConnection = {}

      if (deviceFrom.id !== device.id && deviceTo.id !== device.id) {

        connections.push(connection);
        lines.push(connectionLine);

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

    });

    updateFlow({
      ...selectedFlow,
      connections
    });
  }

  const deleteDevice = useCallback((id) => {
    const newDevices = { ...devices };

    delete newDevices[`${id}`];

    setDevices(newDevices);
  }, [devices]);

  const updateDeviceValue = (deviceId, newValues) => {

    setDevices(prevDevices => {
      return {
        ...prevDevices,
        [`${deviceId}`]: {
          ...prevDevices[`${deviceId}`],
          ...newValues
        }
      }
    })
  }

  const handleZoomChange = (value) => {
    setDeviceScale(value);
  }

  //SOMENTE TESTE
  const handleSetDevice = (device) => {
    setDevices(prevDevices => {
      return {
        ...prevDevices,
        [`${device.id}`]: {
          ...device
        }
      }
    })
  }

  return (
    <DevicesContext.Provider
      value={{
        devices,
        deviceScale,
        addDevice,
        deleteDevice,
        repositionDevice,
        repositionConnections,
        updateDeviceValue,
        handleZoomChange,
        handleSetDevice
      }}
    >
      {children}
    </DevicesContext.Provider>
  )
}

DevicesProvider.propTypes = {
  children: P.element.isRequired
}
