import { useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import SliderIcon from './SliderIcon';

import eventBaseImg from '@/assets/images/devices/event/eventBase.svg';

const Slider = ({
  data, dragRef, onSaveData
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

      redefineBehavior();

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

    if (newValue.send.current === value.send.current) {
      sendValue();

      return;
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
      devices[conn.deviceTo.id].defaultReceiveBehavior({
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
  }, [value.send.current]);


  useEffect(() => {

    updateDeviceValue(id, {
      defaultSendBehavior: connectionReceiver,
      defaultReceiveBehavior: connectionReceiver,
    })
  }, [connectionReceiver]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={eventBaseImg}
        ref={dragRef}
      >

        <SliderIcon currentValue={value.send.current} limit={value.limit} />

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
  onSaveData: P.func.isRequired
}

export default Slider;
