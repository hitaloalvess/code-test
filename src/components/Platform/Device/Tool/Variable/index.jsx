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
    updateDeviceValueInFlow,
    getGroupByName
  } = useStore(store => ({
    flows: store.flows,
    devices: store.devices,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow,
    getGroupByName: store.getGroupByName
  }), shallow);

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

    const group = getGroupByName(value.groupName);
    const groupDevices = group.devices

    group.value = 10;
    console.log(group);


    groupDevices.forEach(element => {
      console.log('Id do grupo: ', element);
      console.log('Device do grupo: ', devices[element]);

      if (devices[element]?.value.send == undefined ){
        console.log('---');
      }
      else{
        console.log('Dispositivo que entrou: ', devices[element])

        const value = {
          ...data.value,
          send: {
            current: group.value
          }
        }

        updateDeviceValue(element, { value });
      }
    });

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
    //Calc values

    const device = { ...devices[connection.deviceFrom.id] };
    let valueReceived = device.value[connection.deviceFrom.connector.name].current;

    //Calc values

    const newValue = {
      ...data.value,
      send: {
        current: valueReceived
      }
    }


    setValueDisplay(valueReceived);
    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });
    sendValue();
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

  const handleChangeValue = () => {
    console.log('Valor alterado: ' + value.send.current + ' em ' + id)
  };

  useEffect(() => {
    handleChangeValue();
  }, [value.send.current]);

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
