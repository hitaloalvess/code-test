import { useEffect, useRef, useCallback, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import * as Pv from './styles.module.css';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';


const Variable = ({
  data, dragRef, onSaveData
}) => {

  const isFirstRender = useRef(true);
  const { id, name, posX, posY, value, connectors } = data;


  const {
    flows,
    devices,
    updateDeviceValue,
    getGroupByName,
    changeDeviceGroupValue,
    devicesGroups,
  } = useStore(store => ({
    flows: store.flows,
    devices: store.devices,
    updateDeviceValue: store.updateDeviceValue,
    getGroupByName: store.getGroupByName,
    changeDeviceGroupValue: store.changeDeviceGroupValue,
    devicesGroups: store.devicesGroups
  }), shallow);

  useEffect(() => {

    if (!value.groupName) return;

    const group = getGroupByName(value.groupName);


    const newValue = {
      ...data.value,
      send: {
        current: group.value
      }
    }

    setValueDisplay(group.value);
    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    sendValue();
  }, [devicesGroups[value.groupName]])


  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);
  const [valueDisplay, setValueDisplay] = useState(value.send.current);


  const connectionReceiver = useCallback(() => {

    setQtdIncomingConn(prev => prev + 1);
  }, [])

  const handleSettingUpdate = useCallback((newGroup) => {

    const newValue = {
      ...data.value,
      groupName: newGroup
    }

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

    changeDeviceGroupValue(value.groupName, valueReceived)

  };


  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      toConnector.defaultReceiveBehavior({
        value: value.send.current
      });
    })
  };

  const redefineBehavior = useCallback(() => {

  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);

  return (
    <>
      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <p className={Pv.passValueNumber}>
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
              data
            }
          }}
          actionDuplicate={{
            data: {
              ...data
            }
          }}
        />
      </DeviceBody>
      <Connectors
        type='doubleTypes'
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

      />

    </>
  );
};

Variable.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Variable;
