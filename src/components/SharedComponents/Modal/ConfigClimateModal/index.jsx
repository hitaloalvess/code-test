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
  btn,
  btnBlue,
} from '@/styles/common.module.css';

const ConfigClimateModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, scaleTypeDefault } = contentData;

  const scaleTypeRef = useRef(null);

  const handleSave = () => {
    const defaultScaleType = scaleTypeRef.current.value;
    handleSaveConfig(defaultScaleType);

    closeModal();
  }

  return (

    <section
      className={configLedContent}
    >
      <header>
        <h1
          className={configLedTitle}
        >
          CLIMATE
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor=' climateScale'
            className={labelInput}
          >
            Selecione uma escala de temperatura:
          </label>

          <select
            ref={scaleTypeRef}
            className="climateSelect"
            defaultValue={scaleTypeDefault}
          >
            <option value="celsius">Celsius</option>
            <option value="fahrenheit">Fahrenheit</option>
            <option value="kelvin">Kelvin</option>
          </select>
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

ConfigClimateModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    scaleTypeDefault: P.string
  }).isRequired
}

export default ConfigClimateModal;
