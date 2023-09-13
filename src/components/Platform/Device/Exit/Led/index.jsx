
import { memo, useCallback } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { findFlowsByDeviceId } from '@/utils/flow-functions';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import LedLight from './LedLight';


const Led = memo(function Led({
  data, dragRef, onSaveData
}) {
  const { id, imgSrc, name, posX, posY, value, connectors } = data;

  const {
    updateDeviceValue,
    updateDeviceValueInFlow,
    getFlows,
  } = useStore(store => ({
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow,
    getFlows: store.getFlows,
  }), shallow);


  const handleSettingUpdate = useCallback((newColor, newBrightness) => {
    const flows = getFlows();

    const hasFlow = findFlowsByDeviceId(flows, id);

    if (hasFlow && newBrightness !== data.value.brightness) {
      defaultReceiveBehavior({ value: newBrightness, max: value.max });
    }

    const value = {
      ...data.value,
      color: newColor,
      brightness: newBrightness
    }

    onSaveData('value', value);

    updateDeviceValue(id, { value });

  }, [data.value]);


  const defaultReceiveBehavior = useCallback((valueReceived) => {
    const { value, max, color } = valueReceived;

    const objValue = {
      ...data.value,
      current: typeof value === 'boolean' ?
        (value ? data.value.brightness : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value,
    }

    const active = objValue.current !== 0 ? true : false;
    const brigthnessValue = objValue.current < 0 ? objValue.current * -1 : objValue.current;
    const opacity = objValue.current !== 0 ? (brigthnessValue / objValue.max) : 0

    const newValue = {
      ...objValue,
      color: color === undefined ? data.value.color : color,
      active,
      opacity
    }


    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.brightness.id, newValue });


  }, [value.brightness, value.color, connectors]);


  const redefineBehavior = useCallback(() => {
    const value = {
      active: false,
      current: 0,
      max: 0,
      type: null,
      color: '#ff1450',
      opacity: 0,
      brightness: 1023
    }

    onSaveData('value', value)

    updateDeviceValue(id, { value });

  }, []);


  return (
    <>
      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >
        <LedLight
          active={value.active}
          color={value.color}
          opacity={value.opacity}
        />

        <ActionButtons
          orientation='right'
          actionDelete={{
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            data: {
              id
            }
          }}
          actionConfig={{
            typeContent: 'config-led',
            onSave: handleSettingUpdate,
            data: {
              defaultColor: data.value.color,
              defaultBrightness: data.value.brightness
            }
          }}
        />
      </DeviceBody>


      <Connectors
        type='entrys'
        exitConnectors={[
          {
            data: {
              ...data.connectors.brightness,
              defaultReceiveBehavior,
              redefineBehavior,
            },
            device: {
              id,
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
      />

    </>
  );
});

Led.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Led;
