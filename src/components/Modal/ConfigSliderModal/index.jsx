import { useRef } from "react";
import P from 'prop-types';

import {
  configSliderContent,
  configSliderTitle,
  inputsArea,
  inputArea,
  labelInput
} from './styles.module.css';

import {
  inputNumber,
  btn,
  btnBlue
} from '@/styles/common.module.css';

const ConfigSliderModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultMaxValue } = contentData;

  const maxValueRef = useRef(null);

  const handleSave = () => {
    const newMaxValue = Number(maxValueRef.current.value);

    handleSaveConfig(newMaxValue);

    closeModal();
  }

  return (


    <section
      className={configSliderContent}
    >
      <header>
        <h1
          className={configSliderTitle}
        >
          Delay
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='rangeSlider'
            className={labelInput}
          >
            Selecione o limite do lider:
          </label>

          <input
            type="number"
            id='rangeSlider'
            min = "0"
            max = "1023"
            className={inputNumber}
            defaultValue={defaultMaxValue}
            ref={maxValueRef}
          />
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

ConfigSliderModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultMaxValue: P.number,
  }).isRequired
}

export default ConfigSliderModal;
