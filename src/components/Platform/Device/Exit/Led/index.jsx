
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import P from 'prop-types';

import { findFlowsByDeviceId } from '@/utils/flow-functions';
import { useDevices } from '@/hooks/useDevices';
import { useFlow } from '@/hooks/useFlow';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import Connectors from '@/components/Platform/Device/SharedDevice/Connectors';
import DeviceBody from '../../SharedDevice/DeviceBody';


import {
  ledLight,
  ledLightElement
} from './styles.module.css';

const Led = memo(function Led({
  data, dragRef, activeActBtns, onChangeActBtns, onSaveData
}) {

  const isFirstRender = useRef(true);
  const { id, imgSrc, name, posX, posY } = data;

  const { updateDeviceValue } = useDevices();
  const { flows, updateDeviceValueInFlow } = useFlow();

  const [lightUpdateData, setLightUpdateData] = useState(null);


  const handleSettingUpdate = useCallback((newColor, newBrightness) => {

    const hasFlow = findFlowsByDeviceId(flows, id);

    if (hasFlow && newBrightness !== data.value.brightness) {
      defaultBehavior({ value: newBrightness, max: data.value.max });
    }

    const value = {
      ...data.value,
      color: newColor,
      brightness: newBrightness
    }

    onSaveData('value', value);

    updateDeviceValue(id, { value });

  }, [data.value, flows]);


  const defaultBehavior = (valueReceived) => {
    if (setLightUpdateData) {
      setLightUpdateData(valueReceived);
    }

  };


  const redefineBehavior = () => {
    const value = {
      active: false,
      current: 0,
      max: 0,
      type: null,
      color: '#ff1450',
      opacity: 0,
      brightness: 1023
    }

    onSaveData('value', value)

    updateDeviceValue(id, { value });

  }

  useEffect(() => {

    updateDeviceValue(id, {
      defaultBehavior,
      redefineBehavior
    })
  }, []);


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      return;
    }

    if (!lightUpdateData) return;

    const { value: newValue, max, color } = lightUpdateData;

    const objValue = {
      current: typeof newValue === 'boolean' ?
        (newValue ? data.value.brightness : 0) : newValue,
      max: typeof newValue === 'boolean' ? 1023 : max,
      type: typeof newValue,
    }

    const active = objValue.current !== 0 ? true : false;
    const brigthnessValue = objValue.current < 0 ? objValue.current * -1 : objValue.current;
    const opacity = objValue.current !== 0 ? (brigthnessValue / objValue.max) : 0

    const value = {
      ...data.value,
      ...objValue,
      color: color === undefined ? data.value.color : color,
      active,
      opacity
    }


    onSaveData('value', value);
    updateDeviceValue(id, { value });
    updateDeviceValueInFlow({ connectorId: data.connectors.brightness.id, newValue: value })


    setLightUpdateData(null);

  }, [lightUpdateData])

  return (
    <>

      <DeviceBody
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
        onChangeActBtns={onChangeActBtns}
      >

        <div className={ledLight}>
          {data.value.active && (
            <svg className={ledLightElement} style={{ fill: `${data.value.color}`, fillOpacity: `${data.value.opacity}` }} viewBox="0 0 51 74"
              xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="25.5" cy="68" rx="7.6" ry="4.1" />
              <path
                d="M25 62.5L1.5 23.8L3 26L3.60233 26.85L4.80116 28.1L6 29.2L7.75 30.5L9.5 31.65L11.25 32.5L13 33.28L14.75 33.9L16.5 34.43L18.5 34.86L19.75 35.12L21 35.2557L23 35.43L25 35.5L26.75 35.45L28.5 35.34L30.25 35.12L32 34.82L34.5 34.25L37 33.47L40 32.2L42 31.1L43 30.43L44 29.72L45.5 28.5L47 26.87L25 62.5Z" />
              <path
                d="M50.5 18C50.5 27.9411 38.8071 35.5 25 35.5C11.1929 35.5 0 27.4411 0 17.5C0 7.55887 11.6929 0 25.5 0C39.3071 0 50.5 8.05887 50.5 18Z" />
            </svg>
          )}
        </div>

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
          actionConfig={{
            typeContent: 'config-led',
            onSave: handleSettingUpdate,
            data: {
              defaultColor: data.value.color,
              defaultBrightness: data.value.brightness
            }
          }}
        />
      </DeviceBody>


      <Connectors
        type='entrys'
        exitConnectors={[
          {
            data: data.connectors.brightness,
            device: {
              id,
              defaultBehavior,
              redefineBehavior,
              containerRef: data.containerRef
            },
            updateConn: { posX, posY },
            handleChangeData: onSaveData
          },
        ]}
      />

    </>
  );
});

Led.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  activeActBtns: P.bool.isRequired,
  onChangeActBtns: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Led;
