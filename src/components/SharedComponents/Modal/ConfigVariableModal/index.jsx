import { useRef, useState } from "react";
import P from 'prop-types';
import { shallow } from 'zustand/shallow';
import { useStore } from '@/store';

import {
  configContent,
  configTitle,
  inputsArea,
  inputArea,
  labelInput,
  inputList
} from './styles.module.css';

import {
  btn,
  btnBlue,
} from '@/styles/common.module.css';


const ConfigVariableModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, data } = contentData;

  const {
    getGroups,
    changeDeviceGroup
  } = useStore(store => ({
    getGroups: store.getGroups,
    changeDeviceGroup: store.changeDeviceGroup
  }), shallow);

  const [groups, setGroups] = useState(getGroups())
  const groupNameRef = useRef(null);

  const handleSave = () => {

    const newGroup = (groupNameRef.current.value).toString();
    changeDeviceGroup(newGroup, data);
    handleSaveConfig(newGroup);

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
          Variável
        </h1>
      </header>

      <div
        className={inputsArea}
      >
        <div
          className={inputArea}
        >
          <label
            htmlFor='variableList'
            className={labelInput}
          >
            Selecione o grupo desejado:
          </label>

          <select
            id="varList"
            className={inputList}
            ref= {groupNameRef}
          >
            {groups.map((group, index)=> (
              <option key= {index} value={group}> {group} </option>
            ))}
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

ConfigVariableModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    data: P.object
  }).isRequired
}

export default ConfigVariableModal;
