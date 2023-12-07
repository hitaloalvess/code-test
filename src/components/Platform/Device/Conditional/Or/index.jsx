import { useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

const Or = ({
  data, dragRef, onSaveData
}) => {
  const isFirstRender = useRef(true);
  const {
    id,
    imgSrc,
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
  const [previousValues, setPreviousValues] = useState();
  const [currentColor, setSetCurrentColor] = useState();

  const connectionReceiver = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1)
  }, []);

  const handleConnections = () => {

    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) {

      const value = {
        ...data.value,
        send: {
          current: false,
          color: undefined
        }
      }

      onSaveData('value', value)
      updateDeviceValue(id, { value });

      return;
    }

    const incomingConns = flow.connections.filter(conn => {
      return conn.deviceTo.id === id
    });

    const values = incomingConns.reduce((acc, conn) => {

      const device = { ...devices[conn.deviceFrom.id] };

      let value = device.value[conn.deviceFrom.connector.name]?.current;
      let color = device.value[conn.deviceFrom.connector.name]?.color;

      if (color != undefined)
        return [...acc, {
          idConnection: conn.id,
          value,
          color
        }];

        return [...acc, {
          idConnection: conn.id,
          value
        }];
    }, []);

    //Calc values
    if (values.length <= 0) {
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

    const incomingConnsValues = values.map(connInput => !connInput.value === false);
    const allValidValues = incomingConnsValues.some(value => value === true);

    const trueValues = values.filter(value=> value.value === true || value.value > 0);
    let newColor = currentColor;

    if (trueValues.length > 0) {
      if(trueValues?.length == previousValues?.length) {
        for (var i = 0; i < trueValues.length; i++) {
          if (trueValues[i].color != previousValues[i].color || trueValues[i].value != previousValues[i].value) {
            newColor = trueValues[i].color != undefined ? trueValues[i].color : currentColor;
            setSetCurrentColor(newColor);
          }
        }
      }
      else {
        if (trueValues?.length < previousValues?.length) {
          newColor = trueValues[trueValues.length - 1].color != undefined ? trueValues[trueValues.length - 1].color : currentColor;
          setSetCurrentColor(newColor);
        } else if (trueValues?.length > previousValues?.length) {
          const teste = trueValues.filter (element => !previousValues.find(valueRef => valueRef.idConnection === element.idConnection));
          newColor = teste[0]?.color != undefined ? teste[0]?.color : currentColor;
          setSetCurrentColor(newColor);
        }
      }
    }

    setPreviousValues(trueValues);

    const value = {
      ...data.value,
      send: {
        current: allValidValues,
        color: newColor
      }
    }

    onSaveData('value', value);
    updateDeviceValue(id, { value });
    updateDeviceValueInFlow({ connectorId: connectors.send.id, newValue: value })
  }

  const sendValue = () => {
    const flow = findFlowsByDeviceId(flows, id);

    if (!flow) return;

    const connsOutput = flow.connections.filter(conn => {
      return conn.deviceFrom.id === id
    });

    connsOutput.forEach(conn => {
      const toConnector = devices[conn.deviceTo.id].connectors[conn.deviceTo.connector.name];
      if(value.send.color !== undefined){
        toConnector.defaultReceiveBehavior({ value: value.send.current, color: value.send.color});
      }
      else{
        toConnector.defaultReceiveBehavior({ value: value.send.current});
      }
    })
  }

  const redefineBehavior = useCallback(() => {
    setQtdIncomingConn(prev => prev + 1);
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


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    sendValue();
  }, [value.send.current, currentColor]);


  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >

        <ActionButtons
          orientation='bottom'
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
            data: {
              ...connectors.send
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


Or.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Or;
