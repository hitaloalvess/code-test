import { useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import ToggleIcon from './ToggleIcon';


import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const devicesDbClick = ['pushButton'];
const Toggle = ({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) => {

  const { id, name, posX, posY, value, connectors, containerRef } = data;

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

  const isFirstRender = useRef(true);
  const [qtdIncomingConn, setQtdIncomingConn] = useState(0);

  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
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
          current: false
        }
      }

      onSaveData('value', value)
      updateDeviceValue(id, { value });

      return;
    }

    const device = { ...devices[connection.deviceFrom.id] };

    let valueReceived = device.value[connection.deviceFrom.connector.name].current;


    let newValue = {
      ...data.value,
      send: {
        current: valueReceived
      }
    }

    //Calc values

    if (devicesDbClick.includes(device.name)) {
      let currentValue = value.send.current;

      if (newValue.send.current) {
        currentValue = currentValue ? false : true
      }

      newValue = {
        ...newValue,
        send: {
          ...newValue.send,
          current: currentValue
        }
      };


      onSaveData('value', newValue);
      updateDeviceValue(id, { value: newValue });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

      return;
    }

    if (typeof newValue.send.current === 'boolean') {
      newValue = {
        ...newValue,
        send: {
          ...newValue.send,
          current: newValue.send.current && !data.value.send.current ? true : false
        }
      }

      onSaveData('value', newValue);
      updateDeviceValue(id, { value: newValue });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

      return;
    }

    if (typeof newValue.send.current === 'number') {

      newValue = {
        ...newValue,
        send: {
          ...newValue.send,
          current: newValue.send.current > 0 ? true : false
        }
      }

      onSaveData('value', newValue);
      updateDeviceValue(id, { value: newValue });
      updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

      return;
    }

  }


  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      devices[conn.deviceTo.id].defaultReceiveBehavior({ value: value.send.current });
    })
  }

  const redefineBehavior = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1);
  }, [value, flows]);


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
      defaultReceiveBehavior: connectionReceiver,
      defaultSendBehavior: connectionReceiver,
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

        <ToggleIcon active={value.send.current} />

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


Toggle.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Toggle;
