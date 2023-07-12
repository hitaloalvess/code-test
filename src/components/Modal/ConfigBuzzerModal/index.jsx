import { useRef } from "react";
import P from 'prop-types';

import {
  configBuzzerContent,
  configBuzzerTitle,
  inputsArea,
  inputArea,
  labelInput
} from './styles.module.css';

import {
  inputNumber,
  btn,
  btnBlue,
  inputRangeContainer,
  inputValue
} from '@/styles/common.module.css';

const ConfigBuzzerModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultDuration, defaultVolume } = contentData;

  const durationRef = useRef(null);
  const volumeRef = useRef(null);
  const showVolumeValueRef = useRef(null);

  const handleSave = () => {
    const newDuration = Number(durationRef.current.value);
    const newVolume = Number(volumeRef.current.value);

    handleSaveConfig(newDuration, newVolume);

    closeModal();
  }

  const handleInputRange = () => {
    const input = volumeRef.current;

    showVolumeValueRef.current.innerHTML = input.value + "%";
  }
  return (

    <section
      className={configBuzzerContent}
    >
      <header>
        <h1
          className={configBuzzerTitle}
        >
          Buzzer
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='buzzerDuration'
            className={labelInput}
          >
            Tempo de duração do audio:
          </label>

          <input
            type="number"
            id='buzzerDuration'
            min="0"
            className={inputNumber}
            defaultValue={defaultDuration}
            ref={durationRef}
          />
        </div>

        <div
          className={inputArea}
        >
          <label
            htmlFor='buzzerVolume'
            className={labelInput}
          >
            Selecione o volume:
          </label>

          <div className={inputRangeContainer}>
            <input
              type="range"
              id='buzzerVolume'
              ref={volumeRef}
              max={1}
              min={0}
              step={0.01}
              defaultValue={defaultVolume}
              onInput={handleInputRange}
            />
            <p
              className={inputValue}
              ref={showVolumeValueRef}
            >
              {defaultVolume}%
            </p>
          </div>
        </div>
      </div>

      <div>
        <button
          className={`${btn} ${btnBlue}`}
          onClick={handleSave}
        >
          Salvar
        </button>
      </div>
    </section>

  );
};

ConfigBuzzerModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultDuration: P.number,
    defaultVolume: P.number
  }).isRequired
}

export default ConfigBuzzerModal;
