import { memo, useEffect } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';
import DeviceBody from '../../SharedDevice/DeviceBody';

const MIN_LUMINOSITY = 0;
const MAX_LUMINOSITY = 1023;

const Ldr = memo(function Ldr({
  data, dragRef, onSaveData
}) {

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


    updateDeviceValueInFlow({ connectorId: data.connectors.luminosity.id, newValue: data.value.luminosity })

    executeFlow({ connectorId: data.connectors.luminosity.id });

  }, [data.value.luminosity.current]);

  return (

    <>

      <DeviceInputs
        inputs={[
          {
            data: {
              minValue: MIN_LUMINOSITY,
              maxValue: MAX_LUMINOSITY,
              step: 1,
              defaultValue: data.value.luminosity.current,
              onInput: (event) => handleOnInput(event, 'luminosity'),
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
            data: data.connectors.luminosity,
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

Ldr.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  onSaveData: P.func.isRequired
}

export default Ldr;
