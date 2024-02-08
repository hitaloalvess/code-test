import { useRef, useState } from "react";
import P from 'prop-types';
import { shallow } from 'zustand/shallow';
import { useStore } from '@/store';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/SharedComponents/Input';
import { Form } from '@/components/SharedComponents/Form'

import {
  configContent,
  configTitle,
  inputsArea,
  inputArea,
  labelInput,
  inputList,
  toggle,
  slider,
  textExit,
  textEntry
} from './styles.module.css';

import {
  btn,
  inputNumber,
  btnWhite
} from '@/styles/common.module.css';


  const ConfigVariableModal = ({closeModal, contentData }) => {
  const { handleSaveConfig, data, defaultGroup, defaultIsConnEntry } = contentData;

  const {
    getGroups,
    updateDeviceGroup,
    addGroup
  } = useStore(store => ({
    getGroups: store.getGroups,
    updateDeviceGroup: store.updateDeviceGroup,
    addGroup: store.addGroup
  }), shallow);

  const [groups,] = useState(getGroups())
  const [hasGroups,] = useState(getGroups().length > 0)
  const selectGroupRef = useRef(null);
  const inputGroupRef = useRef(null);
  const toggleRef = useRef(null);

  const inputValue = z.object({
    value: z.string().nonempty({message: 'Inserir nome da variável'})
  }).required();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    shouldFocusError: false,
    resolver: zodResolver(inputValue)
  });

  const handleSubmitForm = async ({ value }) => {
    const isConnectorEntry = toggleRef.current.checked;

    addGroup(value.toUpperCase(), data);
    handleSaveConfig(value.toUpperCase(), isConnectorEntry);
    closeModal();

    closeModal();
  }

  const handleSave = () => {
    const newGroup = (selectGroupRef.current.value).toString().toUpperCase();
    const isConnectorEntry = toggleRef.current.checked;

    updateDeviceGroup(newGroup, {device: data});
    handleSaveConfig(newGroup, isConnectorEntry);
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
            className={labelInput}
          >
            Componente de:
          </label>
          <label className={toggle}>
            <p className = {textExit} >Saída</p>
            <input type="checkbox" ref={toggleRef} defaultChecked={defaultIsConnEntry}/>
            <span className={slider}></span>
            <p className = {textEntry}>Entrada</p>
          </label>
        </div>


        {hasGroups &&
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
              ref= {selectGroupRef}
              defaultValue={defaultGroup}
            >
              {groups.map((group, index)=> (
                <option key= {index} value={group}> {group} </option>
              ))}
            </select>

            <button
              className={`${btn} ${btnWhite}`}
              onClick={handleSave}
            >
              Selecionar grupo
            </button>
          </div>
          }

          <Form.Root onSubmit={handleSubmit(handleSubmitForm)}
            error = {errors.value}
          >
            <div
            className={inputArea}
            >
              <label
              htmlFor='variableInput'
              className={labelInput}
              >
                Criar novo grupo:
              </label>

              <Input.Root
                error = {errors.value}
                classNames = {inputNumber}
              >
                <input
                  type="text"
                  id = 'variableInput'
                  className={inputNumber}
                  ref = {inputGroupRef}
                  {...register('value')}
                />
              </Input.Root>

              <div>
                <Form.ButtonSubmit
                className = {`${btn} ${btnWhite}`}>
                    <p>Criar grupo</p>
                </Form.ButtonSubmit>
              </div>
            </div>
          </Form.Root>

      </div>
    </section>
  );
};

ConfigVariableModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    handleSaveConfig: P.func,
    data: P.object,
    defaultGroup: P.string,
    defaultIsConnEntry: P.bool,
  }).isRequired
}

export default ConfigVariableModal;
