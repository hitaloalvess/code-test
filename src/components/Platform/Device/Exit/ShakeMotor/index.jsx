
import { memo, useCallback, useEffect, useMemo } from 'react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import * as SM from './styles.module.css';

const ShakeMotor = memo(function ShakeMotor({
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
      current: typeof value === 'boolean' ?
        (value ? 1023 : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value
    }

    let active = false;

    if (objValue?.current !== 0) {
      active = true;
    }

    const newValue = {
      ...objValue,
      active
    }

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.vibration.id, newValue })

  }, [connectors])

  const redefineBehavior = useCallback(() => {

    const value = {
      active: false,
      current: 0,
      max: 0,
      type: null
    }

    onSaveData('value', value)

    updateDeviceValue(id, { value });
  }, []);

  const transformedValue = useMemo(() => {
    if (!value.current) return `0%`;

    const convertedValue = value.current * 100 / value.max;

    return `${convertedValue.toFixed()}%`;
  }, [value.current]);


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
        classImg={`${value.current > 0 ? SM.shake : ''}`}
      >

        <p
          className={SM.numberValue}
        >
          {transformedValue}
        </p>

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
            data: connectors.vibration,
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

ShakeMotor.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default ShakeMotor;
