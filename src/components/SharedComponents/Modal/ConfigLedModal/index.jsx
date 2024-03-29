import { useRef } from "react";
import P from 'prop-types';

import {
  configLedContent,
  configLedTitle,
  inputsArea,
  inputArea,
  labelInput
} from './styles.module.css';

import {
  inputColor,
  btn,
  btnBlue,
  inputRangeContainer,
  inputValue
} from '@/styles/common.module.css';

const ConfigLedModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultColor, defaultBrightness } = contentData;

  const colorRef = useRef(null);
  const brightnessRef = useRef(null);
  const showBrightnessValueRef = useRef(null);

  const handleSave = () => {
    const newColor = colorRef.current.value;
    const newBrightness = Number(brightnessRef.current.value);

    handleSaveConfig(newColor, newBrightness);

    closeModal();
  }

  const handleInputRange = () => {
    const input = brightnessRef.current;

    showBrightnessValueRef.current.innerHTML = input.value;
  }
  return (

    <section
      className={configLedContent}
    >
      <header>
        <h1
          className={configLedTitle}
        >
          Led RGB
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='ledColor'
            className={labelInput}
          >
            Selecione uma cor
          </label>

          <input
            type="color"
            id='ledColor'
            className={inputColor}
            defaultValue={defaultColor}
            ref={colorRef}
          />
        </div>

        <div
          className={inputArea}
        >
          <label
            htmlFor='ledBrightness'
            className={labelInput}
          >
            Selecione a quantidade de brilho
          </label>

          <div className={inputRangeContainer}>
            <input
              type="range"
              id='ledBrightness'
              ref={brightnessRef}
              max={1023}
              min={0}
              defaultValue={defaultBrightness}
              onInput={handleInputRange}
            />
            <p
              className={inputValue}
              ref={showBrightnessValueRef}
            >
              {defaultBrightness}
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

ConfigLedModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultColor: P.string,
    defaultBrightness: P.number
  }).isRequired
}

export default ConfigLedModal;
