import { memo, useEffect } from 'react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';

import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceInputs from '../../SharedDevice/DeviceInputs';
import DeviceBody from '../../SharedDevice/DeviceBody';

const MIN_LUMINOSITY = 0;
const MAX_LUMINOSITY = 1023;

const Ldr = memo(function Ldr({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) {

  const { id, imgSrc, name, posX, posY } = data;

  const { updateDeviceValue } = useDevices();
  const { executeFlow, updateDeviceValueInFlow } = useFlow();


  const handleGetValue = () => {
    return {
      luminosity: {
        value: data.value.luminosity.current,
        max: data.value.luminosity.max
      }
    }
  }

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
    updateDeviceValue(id, {
      defaultBehavior: handleGetValue
    });

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
      {/* <div
        className={deviceBody}
        ref={dragRef}
      >

        <img
          src={imgSrc}
          alt={`Device ${name}`}
          loading='lazy'
        />
      </div>

      <div
        className={`${connectorsContainer} ${connectorsContainerExit}`}
      >
        <ConnectorsConnector
          name={'luminosity'}
          type={'exit'}
          device={{
            id,
            defaultBehavior: handleGetValue,
            containerRef: device.containerRef
          }}
          updateConn={{ posX, posY }}
          handleChangeId={handleChangeLumenConnector}
        />

      </div>



      <div
        className={
          `${actionButtonsContainer} ${actionButtonsContainerLeft}`
        }
      >
        <ActionButton
          onClick={() => enableModal({
            typeContent: 'confirmation',
            title: 'Cuidado',
            subtitle: 'Tem certeza que deseja excluir o componente?',
            handleConfirm: () => {
              deleteDeviceConnections(id);
              deleteDevice(id);
              disableModal('confirmation');
            }
          })}
        >
          <Trash />
        </ActionButton>

      </div> */}
    </>
  );
});

Ldr.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Ldr;
