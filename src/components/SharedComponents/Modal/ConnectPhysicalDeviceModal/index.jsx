import P from 'prop-types';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Lock } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/SharedComponents/Form';
import { Input } from '@/components/SharedComponents/Input';
import { SpinnerLoader } from '@/components/SharedComponents/SpinnerLoader';

import * as UP from './styles.module.css';

const connectPhysicalDeviceSchema = z.object({
  mac: z.string().min(17, { message: 'Endereço mac inválido' })
    .refine((value) => {
      const regex = /^([0-9a-f]{2}[:-]){5}([0-9a-f]{2})$/i;
      return regex.test(value)
    }, { message: 'Endereço mac inválido' })
    .transform(value => value.toUpperCase())
  ,
})

const ConnectPhysicalDeviceModal = ({
  contentData
}) => {
  const { title, handleConfirm, data } = contentData;
  const [isLoading, setIsLoading] = useState(false);


  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectPhysicalDeviceSchema),
    shouldFocusError: false
  });

  const handleSubmitForm = async (formData) => {

    try {
      const data = { ...formData }

      setIsLoading(true);
      await handleConfirm(data);
      setIsLoading(false);

    } catch (error) {
      const { message: errorMessage } = error.response.data;
      setIsLoading(false);
      toast.error(errorMessage);
    }

  }

  const handleChangeValue = (nameField, value) => setValue(nameField, value, { shouldValidate: true })

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
              <Input.TextMaskType
                placeholder={"Digite o endereço mac address"}
                defaultValue={data?.mac ?? ''}
                maskChange={handleChangeValue}
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

ConnectPhysicalDeviceModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    title: P.string,
    handleConfirm: P.func,
    isLoading: P.bool,
    data: P.shape({
      mac: P.string
    })
  }).isRequired
}

export default ConnectPhysicalDeviceModal;
