
import { memo, useCallback, useEffect } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import LedMonoLight from './LedMonoLight';

const LedMono = memo(function Led({
  data, dragRef, onSaveData
}) {

  const {
    id,
    imgSrc,
    name,
    posX,
    posY,
    value,
    connectors,
    containerRef
  } = data;

  const {
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);


  const defaultReceiveBehavior = useCallback((valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      ...data.value,
      current: typeof value === 'boolean' ?
        (value ? data.value.brightness : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value,
    }

    let newValue = {
      ...objValue,
      active: false,
      opacity: 0
    }

    if (objValue?.current !== 0) {
      const { current, max } = objValue;
      const brigthnesValue = current < 0 ? current * -1 : current;

      newValue = {
        ...newValue,
        active: true,
        opacity: brigthnesValue / max
      }

    }

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.lumen.id, newValue })

  }, [value.brightness, connectors]);

  const redefineBehavior = useCallback(() => {

    const value = {
      active: false,
      current: 0,
      max: 0,
      type: null,
      opacity: 0,
      brightness: 1023
    }

    onSaveData('value', value)

    updateDeviceValue(id, { value });
  }, []);

  useEffect(() => {

    updateDeviceValue(id, {
      defaultReceiveBehavior,
      redefineBehavior
    })
  }, [defaultReceiveBehavior, redefineBehavior]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >

        <LedMonoLight active={value.active} opacity={value.opacity} />

        <ActionButtons
          orientation='right'
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
        type='entrys'
        exitConnectors={[
          {
            data: connectors.lumen,
            device: {
              id,
              containerRef: containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
      />

    </>
  );
});

LedMono.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default LedMono;
