import { memo, useEffect } from 'react';
import P from 'prop-types';


import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';
import DeviceBody from '../../SharedDevice/DeviceBody';


const MIN_RADIATION = 0;
const MAX_RADIATION = 1023;

const RainDetector = memo(function RainDetector({
  dragRef, data, activeActBtns, onChangeActBtns, onSaveData
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
  const { executeFlow, updateDeviceValueInFlow } = useFlow();

  const handleOnInput = (event, name) => {
    const inputValue = Number(event.target.value);

    const value = {
      ...data.value,
      [name]: {
        ...data.value[name],
        current: inputValue,
      }
    }

    onSaveData('value', value);
    updateDeviceValue(id, { value })
  }


  useEffect(() => {

    updateDeviceValueInFlow({ connectorId: connectors.radiation.id, newValue: value.radiation })

    executeFlow({ connectorId: connectors.radiation.id });

  }, [value.radiation.current]);


  return (
    <>


      <DeviceInputs
        inputs={[
          {
            data: {
              minValue: MIN_RADIATION,
              maxValue: MAX_RADIATION,
              step: 1,
              defaultValue: value.radiation.current,
              onInput: (event) => handleOnInput(event, 'radiation'),
            },
          }
        ]}
      />


      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >


        <ActionButtons
          orientation='left'
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
        type='exits'
        exitConnectors={[
          {
            data: connectors.radiation,
            device: {
              id,
              containerRef: containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          }
        ]}
      />

    </>
  );
});

RainDetector.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default RainDetector;
