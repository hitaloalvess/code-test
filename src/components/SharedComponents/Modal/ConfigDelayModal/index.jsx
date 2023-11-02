import { useRef } from "react";
import P from 'prop-types';

import {
  configDelayContent,
  configDelayTitle,
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

const ConfigDelayModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, handleRestart, defaultDuration } = contentData;

  const durationRef = useRef(null);

  const handleSave = () => {
    const newDuration = Number(durationRef.current.value);

    handleSaveConfig(newDuration);

    closeModal();
  }

  return (


    <section
      className={configDelayContent}
    >
      <header>
        <h1
          className={configDelayTitle}
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
            htmlFor='delayDuration'
            className={labelInput}
          >
            Tempo de duração do delay:
          </label>

          <input
            type="number"
            id='delayDuration'
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

ConfigDelayModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    handleRestart: P.func,
    defaultDuration: P.number,
  }).isRequired
}

export default ConfigDelayModal;
