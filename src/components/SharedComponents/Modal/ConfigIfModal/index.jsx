import { useRef, useState } from "react";
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
  const { handleSaveConfig, defaultSimbol, defaultValue, connectionType } = contentData;

  const refDefaultSimbol = useRef(null);
  const [value, setValue] = useState(defaultValue);

  const handleInputChange = (event) => {
    const transformFunc = {
      'number': (value) => Number(value),
      'boolean': (value) => value === 'true' ? true : false,
      'string': (value) => value.toUpperCase()
    }
    const value = event.target.value;

    const currentTransformFunc = transformFunc[typeof value];
    const valueTransform = currentTransformFunc(value)

    setValue(valueTransform);
  }

  const handleTransformValue = (variable) => {
    const typesTransform = {
      'number': (value) => Number(value),
      'boolean': (value) => value === 'TRUE' ? true : false,
      'string': (value) => value.toUpperCase()
    }

    const currentTransform = typesTransform[connectionType];

    return currentTransform(variable)
  }

  const handleSave = () => {

    let newVariable = handleTransformValue(value);
    const newSimbol = refDefaultSimbol.current.value;

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
          <select
            defaultValue={defaultSimbol}
            className={selectBox}
            ref={refDefaultSimbol}
          >
            <option value="="> = </option>
            <option value="≠"> ≠ </option>
            <option className={connectionType === 'number' ? '' : disabled} value="&gt;"> &gt; </option>
            <option className={connectionType === 'number' ? '' : disabled} value="&lt;"> &lt; </option>
            <option className={connectionType === 'number' ? '' : disabled} value="≤"> ≤ </option>
            <option className={connectionType === 'number' ? '' : disabled} value="≥"> ≥ </option>
          </select>

          {/* NUMBER ----------------------------------------------------------------------------- */}
          <input
            type="number"
            min='0'
            max='999'
            defaultValue={value}
            className={connectionType === 'number' ? inputNumber : disabled}
            onChange={handleInputChange}
          />

          {/* BOOLEAN  ----------------------------------------------------------------------------- */}
          <select
            defaultValue={value}
            className={connectionType === 'boolean' ? selectBox : disabled}
            onChange={handleInputChange}
          >
            <option value="true"> true </option>
            <option value="false"> false </option>
          </select>


          {/* STRING  ----------------------------------------------------------------------------- */}
          <input
            type="text"
            defaultValue={value}
            className={connectionType === 'string' ? inputNumber : disabled}
            onChange={handleInputChange}

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

ConfigIfModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    defaultSimbol: P.string,
    defaultValue: P.oneOfType([
      P.string,
      P.number,
      P.bool
    ]),
    connectionType: P.string,
  }).isRequired
}

export default ConfigIfModal;
