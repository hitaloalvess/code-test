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

const ConfigDhtModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig } = contentData;

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
          DHT
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor=' dhtScale'
            className={labelInput}
          >
            Selecione uma escala de temperatura:
          </label>

          <select ref={scaleTypeRef} className="dhtSelect">
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

ConfigDhtModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultScaleType: P.string
  }).isRequired
}

export default ConfigDhtModal;
