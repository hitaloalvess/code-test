import { useRef } from "react";
import P from 'prop-types';

import {
  configContent,
  configTitle,
  inputsArea,
  inputArea,
  labelInput
} from './styles.module.css';

import {
  inputNumber,
  btn,
  btnBlue
} from '@/styles/common.module.css';

const ConfigPassValueModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultValueSet } = contentData;

  const valueRef = useRef(null);

  const handleSave = () => {
    const newValue = Number(valueRef.current.value);

    handleSaveConfig(newValue);

    closeModal();
  }

  return (


    <section
      className={configContent}
    >
      <header>
        <h1
          className={configTitle}
        >
          Passa Valores
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='valueSet'
            className={labelInput}
          >
            Escolha o valor que será passado:
          </label>

          <input
            type="number"
            id='valueSet'
            min = "0"
            max = "999"
            className={inputNumber}
            defaultValue={defaultValueSet}
            ref={valueRef}
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

ConfigPassValueModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    handleRestart: P.func,
    defaultValueSet: P.number,
  }).isRequired
}

export default ConfigPassValueModal;
