import { memo, useEffect } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';
import DeviceBody from '../../SharedDevice/DeviceBody';

const MIN_RESISTANCE = 0;
const MAX_RESISTANCE = 1023;

const Potentiometer = memo(function Potentiometer({
  dragRef, data, onSaveData
}) {

  console.log('re-render potênciometro');

  const { id, imgSrc, name, posX, posY } = data;

  const {
    executeFlow,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const handleOnInput = (event, name) => {
    const inputValue = Number(event.target.value);

    const value = {
      ...data.value,
      [`${name}`]: {
        ...data.value[`${name}`],
        current: inputValue,
      }
    }

    onSaveData('value', value);
    updateDeviceValue(id, { value })
  }


  useEffect(() => {

    updateDeviceValueInFlow({ connectorId: data.connectors.resistance.id, newValue: data.value.resistance })

    executeFlow({ connectorId: data.connectors.resistance.id });

  }, [data.value.resistance.current]);

  return (

    <>
      <DeviceInputs
        inputs={[
          {
            data: {
              minValue: MIN_RESISTANCE,
              maxValue: MAX_RESISTANCE,
              step: 1,
              defaultValue: data.value.resistance.current,
              onInput: (event) => handleOnInput(event, 'resistance'),
            },
          }
        ]}
      />


      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >


        <ActionButtons
          orientation='left'
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
        type='exits'
        exitConnectors={[
          {
            data: data.connectors.resistance,
            device: {
              id,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          }
        ]}
      />

    </>
  );
});

Potentiometer.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  onSaveData: P.func.isRequired
}

export default Potentiometer;
