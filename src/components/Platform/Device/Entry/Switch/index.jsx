import { memo, useEffect } from 'react';
import P from 'prop-types';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import switchOn from '@/assets/images/devices/entry/switchOn.svg';

const Switch = memo(function Switch({
  dragRef, data, onSaveData
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
    executeFlow,
    updateDeviceValue,
    updateDeviceValueInFlow
  } = useStore(store => ({
    executeFlow: store.executeFlow,
    updateDeviceValue: store.updateDeviceValue,
    updateDeviceValueInFlow: store.updateDeviceValueInFlow
  }), shallow);

  const handleClick = (newValue, name) => {
    const value = {
      ...data.value,
      [name]: {
        ...data.value[`${name}`],
        current: !newValue,
      }
    }

    onSaveData('value', value);
    updateDeviceValue(id, { value });

  };


  useEffect(() => {

    updateDeviceValueInFlow({ connectorId: connectors.state.id, newValue: value.state })

    executeFlow({ connectorId: connectors.state.id });

  }, [value.state.current]);

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={value.state.current ? switchOn : imgSrc}
        ref={dragRef}
        onClick={() => handleClick(value.state.current, 'state')}
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

Switch.propTypes = {
  dragRef: P.func.isRequired,
  data: P.object.isRequired,
  onSaveData: P.func.isRequired
}

export default Switch;
