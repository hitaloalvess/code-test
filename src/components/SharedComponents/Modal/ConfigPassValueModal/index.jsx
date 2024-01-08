import { useRef } from "react";
import P from 'prop-types';
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
  labelInput
} from './styles.module.css';

import {
  inputNumber,
} from '@/styles/common.module.css';

const ConfigPassValueModal = ({ closeModal, contentData }) => {
  const { handleSaveConfig, defaultValueSet } = contentData;

  const valueRef = useRef(null);


  const inputValue = z.object({
    value: z.string().transform(value => Number(value)).pipe(z.number().min(0, {message: 'Inserir valor maior ou igual a 0'}).max(9999, {message: 'Inserir valor menor ou igual a 9999'}))
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
    handleSaveConfig(Number(value));

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

      <Form.Root onSubmit={handleSubmit(handleSubmitForm)}>
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

          <Input.Root
            error = {errors.value}
            classNames = {inputNumber}
          >
            <input
              type="number"
              id='valueSet'
              className={inputNumber}
              defaultValue={defaultValueSet}
              ref={valueRef}
              {...register('value')}
            />
          </Input.Root>
        </div>
      </div>

      <div>
        <Form.ButtonSubmit>
              <p>Salvar</p>
        </Form.ButtonSubmit>
      </div>
      </Form.Root>
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
