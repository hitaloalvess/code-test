import { useRef } from "react";
import P from 'prop-types';

import {
  disabled,
  configIfContent,
  configIfTitle,
  inputsArea,
  inputArea,
} from './styles.module.css';

import {
  btn,
  btnBlue,
  inputNumber,
  selectBox
} from '@/styles/common.module.css';

const ConfigIfModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultSimbol, defaultNumber, defaultBool, connectionType } = contentData;

    const refDefaultSimbol = useRef(null);
    const refDefaultNumber = useRef(null);
    const refDefaultBool = useRef(null);
    const refDefaultString = useRef(null);

  const handleSave = () => {

    let newVariable;
    const newSimbol = refDefaultSimbol.current.value;

    if (connectionType === 'number'){
      newVariable = Number(refDefaultNumber.current.value);
    }
    else if (connectionType === 'boolean'){
      newVariable = refDefaultBool.current.value === "true" ? true : false;
    }
    else if (connectionType === 'string'){
      newVariable = Text(refDefaultString.current.value);
    }

    handleSaveConfig(newSimbol, newVariable);

    closeModal();
  }

  return (

    <section
      className={configIfContent}
    >
      <header>
        <h1
          className={configIfTitle}
        >
          IF
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <select ref={refDefaultSimbol} defaultValue={defaultSimbol} className={selectBox}>
              <option value="="> = </option>
              <option value="≠"> ≠ </option>
              <option className = {connectionType === 'number' ? '' : disabled} value="&gt;"> &gt; </option>
              <option className = {connectionType === 'number' ? '' : disabled} value="&lt;"> &lt; </option>
              <option className = {connectionType === 'number' ? '' : disabled} value="≤"> ≤ </option>
              <option className = {connectionType === 'number' ? '' : disabled} value="≥"> ≥ </option>
          </select>

        {/* NUMBER ----------------------------------------------------------------------------- */}
          <input
            type="number"
            min = '0'
            max = '999'
            defaultValue={defaultNumber}
            ref={refDefaultNumber}
            className = {connectionType === 'number' ? inputNumber : disabled}
          />

          {/* BOOLEAN  ----------------------------------------------------------------------------- */}
          <select ref={refDefaultBool} defaultValue={defaultBool} className = {connectionType === 'boolean' ? selectBox : disabled}>
            <option value="true"> true </option>
            <option value="false"> false </option>
          </select>


        {/* STRING  ----------------------------------------------------------------------------- */}
          {/* <input
            type="text"
            ref={refDefaultString}
            defaultValue={defaultString}
            className=''
          /> */}
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

ConfigIfModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultSimbol: P.string,
    defaultNumber: P.number,
    defaultBool: P.bool,
    defaultString: P.string,
    connectionType: P.string,
  }).isRequired
}

export default ConfigIfModal;
