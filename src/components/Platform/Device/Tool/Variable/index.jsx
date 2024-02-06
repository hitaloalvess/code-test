import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { useModal } from '@/hooks/useModal';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import * as V from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';


const Variable = ({
  data, dragRef, onSaveData
}) => {

  const isFirstRender = useRef(true);
  const { id, name, posX, posY, value, connectors } = data;

  const { enableModal } = useModal();

  const {
    flows,
    devices,
    updateDeviceValue,
    getGroupByName,
    devicesGroups,
    updateDeviceGroup,
    deleteConnection
  } = useStore(store => ({
    flows: store.flows,
    devices: store.devices,
    updateDeviceValue: store.updateDeviceValue,
    getGroupByName: store.getGroupByName,
    devicesGroups: store.devicesGroups,
    updateDeviceGroup: store.updateDeviceGroup,
    deleteConnection: store.deleteConnection
  }), shallow);

  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);
  const [isConnectorEntry, setIsConnectorEntry] = useState(false);
  const [valueDisplay, setValueDisplay] = useState(value.send.current);

  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1);
  }, [])

  const handleSettingUpdate = useCallback((newGroup, newIsConnectorEntry) => {
    const newValue = {
      ...data.value,
      groupName: newGroup
    }

    setIsConnectorEntry(newIsConnectorEntry);

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
  }, []);

  const handleConnections = () => {
      const flow = findFlowsByDeviceId(flows, id);

      const connection = flow?.connections.find(conn => {
        return conn.deviceTo.id === id
      });

      if (!flow || !connection) {
        const value = {
          ...data.value,
          send: {
            current: 0
          }
        }

        onSaveData('value', value)
        updateDeviceValue(id, { value });
        return;
      }

      const device = { ...devices[connection.deviceFrom.id] };
      let valueReceived = device.value[connection.deviceFrom.connector.name].current;

      updateDeviceGroup(value.groupName, {value: valueReceived})
  };

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    const groupValue = getGroupByName(value.groupName).value;
    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({
        value: groupValue
      });
    })
  };

  const redefineBehavior = useCallback(() => {

  }, []);

  useEffect(() => {
    if (!value.groupName) return;

    const group = getGroupByName(value.groupName);
    const newValue = {
      ...data.value,
      send: {
        current: group.value
      }
    }

    setValueDisplay((group.value).toString());
    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
  }, [devicesGroups[value.groupName]])

  useEffect(() => {
    sendValue();
  }, [value.send.current])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (qtdIncomingConn > 0) {
      handleConnections();
    }
    else if (value.groupName === null)
    {
      enableModal({
        typeContent: 'config-variable',
        enableClose: false,
        handleSaveConfig: handleSettingUpdate,
        data: {
          ...data
        }
      });
    }
  }, [qtdIncomingConn]);

  useEffect(() => {
    const flow = findFlowsByDeviceId(flows, id);
    flow?.connections.find(conn => {
      deleteConnection({idConnection: conn.id, idLine: conn.idLine})
    });
  }, [isConnectorEntry])

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >
        <p className={V.titleDisplay}>
          {value.groupName}
        </p>
        <p className={V.numberDisplay}>
          {valueDisplay}
        </p>

        <ActionButtons
          orientation='bottom'
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            typeContent: 'config-variable',
            onSave: handleSettingUpdate,
            data: {
              data,
              defaultGroup: value.groupName,
              defaultIsConnEntry: isConnectorEntry,
            },

          }}
          actionDuplicate={{
            data: {
              ...data
            }
          }}
        />
      </DeviceBody>
      {!isConnectorEntry &&      <Connectors
        type='entrys'
        entryConnectors={[
          {
            data: {
              ...connectors.receive,
              defaultReceiveBehavior: connectionReceiver,
              redefineBehavior
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
      />}

      {isConnectorEntry && <Connectors
        type='exits'
        exitConnectors={[
          {
            data: {
              ...connectors.send,
              defaultSendBehavior: connectionReceiver,
              redefineBehavior
            },
            device: { id },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
      />}

    </>
  );
};

Variable.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Variable;
