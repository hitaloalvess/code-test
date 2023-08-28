import { memo, useEffect } from 'react';
import P from 'prop-types';

import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';

import pushButtonOn from '@/assets/images/devices/entry/pushButtonOn.svg';


const PushButton = memo(function PushButton({
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

  const handleGetValue = () => {
    return {
      state: {
        current: data.value.state.current
      }
    };
  };


  const handleClick = (newValue, name) => {
    const value = {
      ...data.value,
      [name]: {
        ...data.value[`${name}`],
        current: newValue,
      }
    }

    onSaveData('value', value);
    updateDeviceValue(id, { value });

  };


  useEffect(() => {
    updateDeviceValue(id, {
      defaultBehavior: handleGetValue
    });

    updateDeviceValueInFlow({ connectorId: connectors.state.id, newValue: value.state })

    executeFlow({ connectorId: connectors.state.id });

  }, [value.state.current]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={value.state.current ? pushButtonOn : imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
        onMouseUp={() => handleClick(false, 'state')}
        onMouseDown={() => handleClick(true, 'state')}
        onDragEnd={() => handleClick(false, 'state')}
        onTouchStart={() => handleClick(true, 'state')}
        onTouchEnd={() => handleClick(false, 'state')}
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
            data: connectors.state,
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

PushButton.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default PushButton;
