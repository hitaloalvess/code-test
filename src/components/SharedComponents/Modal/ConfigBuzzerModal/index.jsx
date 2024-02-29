import { useMemo, useState } from "react";
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

  const [value, setValue] = useState(() => {
    return {
      duration: defaultDuration,
      volume: defaultVolume
    }
  })

  const handleSave = () => {
    const newDuration = Number(value.duration);
    const newVolume = Number(value.volume);

    handleSaveConfig(newDuration, newVolume);

    closeModal();
  }

  const handleInputRange = (event, name) => {
    const inputValue = event.target.value;

    const newValue = {
      ...value,
      [name]: inputValue
    }

    setValue(newValue);
  }

  const transformedVolumeValue = useMemo(() => {
    const transformValue = value.volume * 100;

    return `${transformValue}%`;
  }, [value.volume]);

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
            onChange={(event) => handleInputRange(event, 'duration')}
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
              max={1}
              min={0}
              step={0.1}
              defaultValue={defaultVolume}
              onInput={(event) => handleInputRange(event, 'volume')}
            />
            <p
              className={inputValue}
            >
              {transformedVolumeValue}
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
