
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

const CHAR_LIMIT = 512;
const [remainingChars, setRemainingChars] = useState(CHAR_LIMIT - value.text.length);
const textArea = useRef();

const handleSettingUpdate = useCallback((newColor) => {
  const newValue = {
    ...data.value,
      color: newColor
  }

  onSaveData('value', newValue)
  updateDeviceValue(id, { value: newValue });

}, [value]);

  const handleOnInput = () => {
    const newValue = {
      ...data.value,
      text: textArea.current.value
    }
    onSaveData('value', newValue)
    updateDeviceValue(id, { value: newValue });

    setRemainingChars(CHAR_LIMIT - textArea.current.value.length)
  }


  return (
    <>
      <DeviceBody
        classesForBody={[S.testBg]}
        name={name}
        imgSrc={imgSrc}
        ref={dragRef}
      >
        <div className = {S.note} style={{backgroundColor: value.color}}>
          <textarea ref = {textArea} className={S.inputText}  maxLength={CHAR_LIMIT} onInput={handleOnInput} defaultValue = {value.text}></textarea>
          <p className={S.charactersCount}>{remainingChars}</p>
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
