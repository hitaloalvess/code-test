import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import P from 'prop-types';

import { apiAuth } from '@/services/apiAuth';
import { Form } from '@/components/SharedComponents/Form';
import { Input } from '@/components/SharedComponents/Input';
import { InputPassword } from '@/components/SharedComponents/Input/InputPasswordType';

import * as UP from './styles.module.css';
import { Lock } from '@phosphor-icons/react';

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    .refine((value) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!_])[A-Za-z\d@#$%^&+=!_]+$/
      return regex.test(value)
    }, { message: 'Senha deve conter caracteres especiais, números, letras maiúsculas e minúsculas' }),

  newPassword: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    .refine((value) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!_])[A-Za-z\d@#$%^&+=!_]+$/
      return regex.test(value)
    }, { message: 'Senha deve conter caracteres especiais, números, letras maiúsculas e minúsculas' }),

  confirmPassword: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
})
  .refine(({ newPassword, currentPassword }) => newPassword !== currentPassword, {
    message: 'Digite uma senha diferente da atual',
    path: ['newPassword']
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword']
  });

const UpdatePasswordModal = ({
  contentData, closeModal
}) => {
  const { title } = contentData;

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    shouldFocusError: false
  });

  const isFirstRender = useRef(true);
  const [hasCompletedFields, setHasCompletedFields] = useState(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentPassword = !!watch('currentPassword');
    const newPassword = !!watch('newPassword');
    const confirmPassword = !!watch('confirmPassword');

    setHasCompletedFields(currentPassword && newPassword && confirmPassword ? false : true)

  }, [watch('currentPassword'), watch('newPassword'), watch('confirmPassword')])

  const handleSubmitForm = async (formData) => {

    const data = {
      ...formData,
    }
    delete data.confirmPassword;

    try {

      await apiAuth.put('users/passwords', data);
      toast.success('Senha atualizada com sucesso!');

      closeModal();
    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  return (

    <section
      className={UP.content}
    >

      <header
        className={UP.header}
      >

        <h1
        >
          {title}
        </h1>
      </header>

      <Form.Root onSubmit={handleSubmit(handleSubmitForm)}>

        <Form.Content>

          <Form.Row >

            <Input.Root
              error={errors.currentPassword}
            >
              <Input.Icon icon={<Lock />} />
              <Input.PasswordType
                placeholder={"Senha atual"}
                {...register('currentPassword')}
              >
                <InputPassword.Icon />
              </Input.PasswordType>
            </Input.Root>

          </Form.Row>

          <Form.Row >

            <Input.Root
              error={errors.newPassword}
            >
              <Input.Icon icon={<Lock />} />
              <Input.PasswordType
                placeholder={"Nova Senha"}
                {...register('newPassword')}
              >
                <InputPassword.Icon />
              </Input.PasswordType>
            </Input.Root>

          </Form.Row>

          <Form.Row >

            <Input.Root
              error={errors.confirmPassword}
            >
              <Input.Icon icon={<Lock />} />
              <Input.PasswordType
                placeholder={"Confirmar Senha"}
                {...register('confirmPassword')}
              >
                <InputPassword.Icon />
              </Input.PasswordType>
            </Input.Root>

          </Form.Row>

          <Form.ButtonSubmit disabled={hasCompletedFields}>
            <p>Atualizar</p>
          </Form.ButtonSubmit>

        </Form.Content>

      </Form.Root>
    </section>
  );
};

UpdatePasswordModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    title: P.string,
    handleConfirm: P.func,
  }).isRequired
}

export default UpdatePasswordModal;
