import { useEffect, useState, useCallback, useRef } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';
import PickColorIcon from './PickColorIcon';

const PickColor = ({
  data, dragRef, onSaveData
}) => {

  const isFirstRender = useRef(true);
  const {
    id,
    name,
    posX,
    posY,
    value,
    connectors,
  } = data;

  const {
    flows,
    devices,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    flows: store.flows,
    devices: store.devices,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);


  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleSettingUpdate = useCallback((newColor) => {
    const newValue = {
      ...value,
      send: {
        ...value.send,
        color: newColor
      }
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

  }, [value]);


  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!flow || !connection) {
      redefineBehavior();
      return;
    }


    const device = { ...devices[connection.deviceFrom.id] };
    const deviceValueCurrent = device.value[connection.deviceFrom.connector.name].current;
    const deviceValueMax  = device.value[connection.deviceFrom.connector.name].max;

    const newValue = {
      ...data.value,
      send: {
        ...data.value.send,
        current: deviceValueCurrent,
        max: deviceValueMax
      }
    }


    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

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
        value: value.send.current,
        max: value.send.max,
        color: value.send.color
      });
    })
  }

  const redefineBehavior = useCallback(() => {
    const newValue = {
      ...value,
      send: {
        ...value.send,
        current: 0,
        max: 0,
      }
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
  }, [value]);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    sendValue();
  }, [value]);


  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <PickColorIcon color={value.send.color} />

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
            typeContent: 'config-pickColor',
            onSave: handleSettingUpdate,
            data: {
              defaultColor: value.send.color,
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


PickColor.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default PickColor;
