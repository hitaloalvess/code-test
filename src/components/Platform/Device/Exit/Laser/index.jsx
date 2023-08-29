import { memo, useCallback, useEffect } from 'react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import LaserLight from './LaserLight';


const Laser = memo(function Laser({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
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
  const { updateDeviceValue } = useDevices();
  const { updateDeviceValueInFlow } = useFlow();


  const defaultBehavior = useCallback((valueReceived) => {
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
    updateDeviceValueInFlow({ connectorId: connectors.intensity.id, newValue })


  }, [value.brightness, connectors])

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
  }, [])

  useEffect(() => {

    updateDeviceValue(id, {
      defaultBehavior,
      redefineBehavior
    })
  }, [defaultBehavior, redefineBehavior]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

        <LaserLight active={value.active} opacity={value.opacity} />

        <ActionButtons
          orientation='right'
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
        type='entrys'
        exitConnectors={[
          {
            data: connectors.intensity,
            device: {
              id,
              defaultBehavior,
              redefineBehavior,
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

Laser.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Laser;
