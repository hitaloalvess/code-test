import { useCallback, useEffect, useState } from 'react';
import P from 'prop-types';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useFlow } from '@/hooks/useFlow';
import { useDevices } from '@/hooks/useDevices';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import SliderIcon from './SliderIcon';


const Slider = ({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) => {

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

  const handleSettingUpdate = useCallback((newLimit) => {

    const newValue = {
      ...data.value,
      limit: newLimit
    }
    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

    setQtdIncomingConn(prev => prev + 1);

  }, [value]);


  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleConnections = () => {
    const flow = findFlowsByDeviceId(flows, id);

    const connection = flow?.connections.find(conn => {
      return conn.deviceTo.id === id
    });

    if (!flow || !connection) {

      const newValue = {
        ...data.value,
        send: {
          ...data.value.send,
          current: 0,
          max: 0
        }
      }

      onSaveData('value', newValue)
      updateDeviceValue(id, { value: newValue });

      return;
    }

    const device = { ...devices[connection.deviceFrom.id] };
    const deviceValue = device.value[connection.deviceFrom.connector.name];

    const newValue = {
      ...data.value,
      send: {
        ...deviceValue,
        current: deviceValue.current > value.limit ? value.limit : deviceValue.current
      }
    }

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue });

  }

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      conn.deviceTo.defaultReceiveBehavior({
        value: value.send.current,
        max: value.send.max
      });
    })
  }

  const redefineBehavior = useCallback(() => {
    const newValue = {
      ...value,
      send: {
        ...value.send,
        current: 0,
        max: 0
      }
    }

    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });
  }, [])



  useEffect(() => {
    if (qtdIncomingConn > 0) {
      handleConnections();
    }
  }, [qtdIncomingConn]);

  useEffect(() => {
    sendValue();
  }, [value.send.current]);


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

        <SliderIcon currentValue={value.send.current} limit={value.limit} />

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
            typeContent: 'config-slider',
            onSave: handleSettingUpdate,
            data: {
              defaultMaxValue: value.limit
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


Slider.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Slider;
