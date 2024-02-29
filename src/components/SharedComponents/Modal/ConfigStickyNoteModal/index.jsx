import { useRef } from "react";
import P from 'prop-types';

import {
  configSliderContent,
  configSliderTitle,
  inputsArea,
  inputArea,
  labelInput,
  inputColor
} from './styles.module.css';

import {
  btn,
  btnBlue
} from '@/styles/common.module.css';

const ConfigStickyNoteModal = ({ closeModal, contentData }) => {
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
          Bloco de Notas
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='stickyNote'
            className={labelInput}
          >
            Selecione a cor desejada:
          </label>

          <input
            type="color"
            id='stickyNote
            '
            list="stickyNoteList"
            className={inputColor}
            defaultValue={defaultColor}
            ref={colorRef}
          />
          <datalist id="stickyNoteList">
            <option value="#F5B9B9">Rosa</option>
            <option value="#f5efb9">Amarelo</option>
            <option value="#b6a8e3">Lilás</option>
            <option value="#aec3cf">Azul</option>
            <option value="#a5d3bd">Verde Água</option>
            <option value="#b9d3a5">Verde</option>
            <option value="#ddc59c">Laranja</option>
            <option value="#cd7777">Vermelho</option>
            <option value="#779acd">Azul Escuro</option>
          </datalist>
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

ConfigStickyNoteModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultColor: P.string,
  }).isRequired
}

export default ConfigStickyNoteModal;
