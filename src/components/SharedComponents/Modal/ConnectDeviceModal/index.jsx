import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import P from 'prop-types';

import { Form } from '@/components/SharedComponents/Form';
import { Input } from '@/components/SharedComponents/Input';
import { SpinnerLoader } from '@/components/SharedComponents/SpinnerLoader';

import * as UP from './styles.module.css';
import { Lock } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

const updatePasswordSchema = z.object({
  mac: z.string().min(12, { message: 'O endereço mac deve ter no mínimo 12 caracteres' })
    .refine((value) => {
      const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      return regex.test(value)
    }, { message: 'Mac address inválido' }),
})

const ConnectDeviceModal = ({
  contentData
}) => {
  const { title, handleConfirm } = contentData;
  const [isLoading, setIsLoading] = useState(false);


  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    shouldFocusError: false
  });

  const handleSubmitForm = async (formData) => {

    try {
      const data = {
        ...formData,
      }

      setIsLoading(true);
      handleConfirm(data);

    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  useEffect(() => {

    return () => {
      setIsLoading(false);
    }
  }, []);

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
              error={errors.mac}
            >
              <Input.Icon icon={<Lock />} />
              <Input.TextType
                placeholder={"Insira o endereço mac"}
                {...register('mac')}
              />
            </Input.Root>

          </Form.Row>


          <Form.ButtonSubmit>
            {isLoading ? <SpinnerLoader.Icon /> : <p>Registrar</p>}
          </Form.ButtonSubmit>

        </Form.Content>

      </Form.Root>
    </section>
  );
};

ConnectDeviceModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    title: P.string,
    handleConfirm: P.func,
    isLoading: P.bool
  }).isRequired
}

export default ConnectDeviceModal;
