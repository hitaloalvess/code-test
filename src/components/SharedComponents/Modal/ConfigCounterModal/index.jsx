import { useRef, useState } from "react";
import P from 'prop-types';

import {
  configIfContent,
  configIfTitle,
  inputsArea,
  inputArea,
  toggle,
  slider,
  labelInput
} from './styles.module.css';

import {
  btn,
  btnBlue,
  btnWhite,
  inputNumber
} from '@/styles/common.module.css';

const ConfigCounterModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultLoopActive, defaultLoopLimit, handleRestart} = contentData;

    const toggleRef = useRef(null);
    const limitRef = useRef(null);
    const [isLoopActive, setIsLoopActive] = useState(defaultLoopActive);

  const handleSave = () => {
    const limit = limitRef.current === null ? 9999 : Number(limitRef.current.value);
    handleSaveConfig(toggleRef.current.checked, limit);
    closeModal();
  }

  const handleLoopActive = () => {
    setIsLoopActive(prev => !prev);
  }

  return (

    <section
      className={configIfContent}
    >
      <header>
        <h1
          className={configIfTitle}
        >
          Counter
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >

          <label
            className={labelInput}
          >
            Loop:
          </label>
          <label className={toggle}>
            <input type="checkbox" ref={toggleRef} defaultChecked={defaultLoopActive} onClick = {handleLoopActive}/>
            <span className={slider}></span>
          </label>
          { isLoopActive &&
            (<>
            <label
              className={labelInput}
            >
              Limite do loop:
            </label>

            <input
              type="number"
              min = '0'
              max = '9999'
              defaultValue={defaultLoopLimit}
              ref = {limitRef}
              className = {inputNumber}
            />
            </>)
          }

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
    </section>

  );
};

ConfigCounterModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultLoopActive: P.bool,
    defaultLoopLimit: P.number,
    handleRestart: P.func
  }).isRequired
}

export default ConfigCounterModal;
