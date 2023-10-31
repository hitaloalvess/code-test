
import { memo, useRef, useState, useCallback } from 'react';
import P from 'prop-types';
import ActionButtons from '@/components/Platform/Device/SharedDevice/ActionButtons';
import DeviceBody from '../../SharedDevice/DeviceBody';
import { shallow } from 'zustand/shallow';
import { useStore } from '@/store';

import * as S from './styles.module.css';

const Stickynote = memo(function Led({
  data, dragRef, onSaveData
}) {

  const {
    id,
    imgSrc,
    name,
    value
  } = data;


  const {
    updateDeviceValue
  } = useStore(store => ({
    updateDeviceValue: store.updateDeviceValue,
  }), shallow);


const [charLimit] = useState(512);
const [remainingChars, setRemainingChars] = useState(charLimit - value.text.length);
const textArea = useRef();
const charactersCount = useRef();

  const teste = () => {
    console.log(value);
    const newValue = {
      ...data.value,
      text: textArea.current.value
    }
    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

    setRemainingChars(charLimit - textArea.current.value.length)
  }

  const handleSettingUpdate = useCallback((newColor) => {
    const newValue = {
      ...data.value,
        color: newColor
    }

    console.log(value.color);
    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

  }, [value]);

  return (
    <>
      <DeviceBody
        classesForBody={[S.testBg]}
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >
        <div className = {S.note} style={{backgroundColor: value.color}}>
          <textarea ref = {textArea} className={S.inputText}  maxLength={charLimit} onInput={teste} defaultValue = {value.text}></textarea>
          <p ref = {charactersCount} className={S.charactersCount}>{remainingChars}</p>
        </div>


      <ActionButtons
        orientation='bottom'
        actionDelete={{
          title: 'Cuidado',
          subtitle: 'Tem certeza que deseja excluir o componente?',
          data: {
            id
          }
        }}
        actionConfig={{
          typeContent: 'config-stickyNote',
          onSave: handleSettingUpdate,
          data: {
            handleSaveConfig: handleSettingUpdate,
            defaultColor: value.color,
          }
        }}
      />
      </DeviceBody>

    </>
  );
});

Stickynote.propTypes = {
  data: P.object.isRequired,
  dragRef: P.func.isRequired,
  onSaveData: P.func.isRequired
}

export default Stickynote;
