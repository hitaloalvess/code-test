import { useEffect, useState, useCallback, useRef } from 'react';
import P from 'prop-types';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';
import PickColorIcon from './PickColorIcon';

const PickColor = ({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) => {

  const isFirstRender = useRef(true);
  const {
    id,
    name,
    posX,
    posY,
    value,
    connectors,
    containerRef
  } = data;
  const { updateDeviceValue, devices } = useDevices();
  const { updateDeviceValueInFlow, flows } = useFlow();

  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);


  const connectionReceiver = useCallback(() => {
    ('Connection receive pick color')
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
    const deviceValue = device.value[connection.deviceFrom.connector.name];

    const newValue = {
      ...data.value,
      send: {
        ...data.value.send,
        ...deviceValue
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
      devices[conn.deviceTo.id].defaultReceiveBehavior({
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


  useEffect(() => {

    updateDeviceValue(id, {
      defaultSendBehavior: connectionReceiver,
      defaultReceiveBehavior: connectionReceiver,
      redefineBehavior
    })
  }, [connectionReceiver, redefineBehavior]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

        <PickColorIcon color={value.send.color} />

        <ActionButtons
          orientation='bottom'
          active={activeActBtns}
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
            data: connectors.receive,
            device: {
              id,
              containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
        entryConnectors={[
          {
            data: connectors.send,
            device: {
              id,
              containerRef
            },
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
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default PickColor;
