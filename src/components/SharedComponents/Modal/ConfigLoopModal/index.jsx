import { useRef } from "react";
import P from 'prop-types';

import {
  configLoopContent,
  configLoopTitle,
  inputsArea,
  inputArea,
  labelInput
} from './styles.module.css';

import {
  inputNumber,
  btn,
  btnBlue,
  btnWhite
} from '@/styles/common.module.css';

const ConfigLoopModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, handleRestart, defaultDuration } = contentData;

  const durationRef = useRef(null);

  const handleSave = () => {
    const newDuration = Number(durationRef.current.value);

    handleSaveConfig(newDuration);

    closeModal();
  }

  return (


    <section
      className={configLoopContent}
    >
      <header>
        <h1
          className={configLoopTitle}
        >
          Loop
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='loopDuration'
            className={labelInput}
          >
            Tempo de duração do loop:
          </label>

          <input
            type="number"
            id='loopDuration'
            min = "0"
            max = "999"
            className={inputNumber}
            defaultValue={defaultDuration}
            ref={durationRef}
          />
        </div>

        <div
          className={inputArea}
        >
          <button
            className={`${btn} ${btnWhite}`}
            onClick={handleRestart}
          >
            Restart
          </button>
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

ConfigLoopModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    handleRestart: P.func,
    defaultDuration: P.number,
  }).isRequired
}

export default ConfigLoopModal;
