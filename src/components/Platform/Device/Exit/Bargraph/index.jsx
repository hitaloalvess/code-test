
import { memo, useCallback, useState } from 'react';
import P from 'prop-types';

import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';
import BargraphLights from './BargraphLights';


const AMOUNT_LIGHTS = 8;
const Bargraph = memo(function Bargraph({
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
  } = data;

  const {
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const [lightsActive, setLightsActive] = useState(0);

  const defaultReceiveBehavior = useCallback((valueReceived) => {
    const { value, max } = valueReceived;

    const objValue = {
      ...value,
      current: typeof value === 'boolean' ?
        (value ? data.value.brightness : 0) : value,
      max: typeof value === 'boolean' ? 1023 : max,
      type: typeof value,
    }

    let newValue = {
      ...objValue,
      active: false,
      opacity: 0,
    }


    if (objValue?.current !== 0) {
      const { current, max } = objValue;

      const stepValue = max / AMOUNT_LIGHTS;
      let numberLights = AMOUNT_LIGHTS;


      for (let i = 0; i <= AMOUNT_LIGHTS; i++) {
        if (stepValue * i > current) {
          numberLights--;
        }
      }

      if (numberLights < 0) numberLights = 0;

      setLightsActive(numberLights);
      newValue = {
        ...objValue,
        active: true
      }
    }

    onSaveData('value', newValue);
    updateDeviceValue(id, { value: newValue });
    updateDeviceValueInFlow({ connectorId: connectors.lumen.id, newValue })

  }, [connectors, value.brightness])

  const redefineBehavior = useCallback(() => {
    const value = {
      active: false,
      current: 0,
      max: 0,
      type: null,
      brightness: 1023
    }

    setLightsActive(0);

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

        <BargraphLights numActiveLights={lightsActive} />

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
            data: {
              ...connectors.lumen,
              defaultReceiveBehavior,
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
});

Bargraph.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Bargraph;
