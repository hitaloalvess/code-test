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
  inputColor,
  btn,
  btnBlue
} from '@/styles/common.module.css';

const ConfigPickColorModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultColor } = contentData;

  const colorRef = useRef(null);

  const handleSave = () => {
    const newColor = colorRef.current.value;

    handleSaveConfig(newColor);

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
          Pick Color
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='pickColor'
            className={labelInput}
          >
            Selecione o limite do slider:
          </label>

          <input
            type="color"
            id='pickColor'
            className={inputColor}
            defaultValue={defaultColor}
            ref={colorRef}
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

ConfigPickColorModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultColor: P.string,
  }).isRequired
}

export default ConfigPickColorModal;
