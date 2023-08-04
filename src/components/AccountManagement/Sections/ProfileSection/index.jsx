import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Cake, Flag, PhoneCall, User } from '@phosphor-icons/react';

import { api } from '@/services/api';
import { useContextAuth } from '@/hooks/useAuth';
import { isValidPhoneNumber, removeSpaces, removeSpecialCharacters } from '@/utils/form-validation-functions';
import { Form } from '@/components/shared/Form';
import { Input } from '@/components/shared/Input';

import * as S from '../styles.module.css';


const signUpSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  phone: z.string().nonempty('Telefone é obrigatório'),
  genre: z.string().nonempty('Campo gênero é obrigatório'),
  nasc: z.string().nonempty('Data é obrigatório').pipe(z.coerce.date()),
  country: z.string().nonempty('País é obrigatório'),
  state: z.string().nonempty('Estado é obrigatório'),
  city: z.string().nonempty('Cidade é obrigatório'),
})
  .refine(({ phone }) => isValidPhoneNumber(phone), {
    message: 'Telefone inválido',
    path: ['phone']
  });


const ProfileSection = () => {

  const { user } = useContextAuth();

  const navigate = useNavigate();
  const { handleSubmit, register, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    shouldFocusError: false
  });

  const handleChangeValue = (nameField, value) => setValue(nameField, value, { shouldValidate: true })

  const handleSubmitForm = async (formData) => {
    const transformPhone = removeSpaces(removeSpecialCharacters(formData.phone));
    const transformNasc = new Date(formData.nasc);

    const data = {
      ...formData,
      phone: transformPhone,
      nasc: transformNasc
    }

    try {

      await api.patch(`/users/update/${user.id}`, data);
      toast.success('Usuário atualizado com sucesso!');

      return navigate('/');

    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <section className={S.sectionItem} id='profile'>

      <div>
        <h2 >Meu perfil</h2>
      </div>

      <Form.Root onSubmit={handleSubmit(handleSubmitForm)}>
        <Form.Content>
          <Form.Row >
            <Form.Label
              text='Nome'
              id={'Nome'}
            />
            <Input.Root
              error={errors.name}
            >
              <Input.Icon
                icon={<User />}
              />
              <Input.TextType
                id={'Nome'}
                placeholder={"Nome completo"}
                defaultValue={user.name}
                {...register('name')}
              />
            </Input.Root>
          </Form.Row>

          <Form.Row>
            <Form.Label
              text='Cpf'
              id={'cpf'}
            />

            <Input.Root
            >
              <Input.Icon
                icon={<User />}
              />
              <Input.TextMaskType
                id={'cpf'}
                placeholder={"Digite seu cpf"}
                defaultValue={user.cpf}
                name={'cpf'}
                disabled={true}
                maskChange={handleChangeValue}
              />
            </Input.Root>
          </Form.Row>


          <Form.Row>

            <Form.Label
              text='Telefone'
              id={'phone'}
            />

            <Input.Root
              error={errors.phone}
            >
              <Input.Icon
                icon={<PhoneCall />}
              />
              <Input.TextMaskType
                id={'phone'}
                placeholder={"+55 (00) 00000-0000"}
                defaultValue={user.phone}
                maskChange={handleChangeValue}
                {...register('phone')}
              />
            </Input.Root>
          </Form.Row>


          <Form.Row columns={2}>

            <Form.Column>
              <Form.Label
                text='Gênero'
                id={'genre'}
              />

              <Input.Root
                error={errors.genre}
              >

                <Input.SelectType
                  id={'genre'}
                  defaultOptTxt='Selecione seu gênero'
                  options={['MASCULINO', 'FEMININO', 'OUTRO']}
                  defaultValue={user.genre}
                  hasIconSibling={false}
                  {...register('genre')}
                />
              </Input.Root>
            </Form.Column>


            <Form.Column>
              <Form.Label
                text='Data de nascimento'
                id={'nasc'}
              />
              <Input.Root
                error={errors.nasc}
              >
                <Input.Icon
                  icon={<Cake />}
                />
                <Input.DateType
                  id={'nasc'}
                  defaultValue={user.nasc}
                  {...register('nasc')}
                />
              </Input.Root>
            </Form.Column>

          </Form.Row>


          <Form.Row columns={3}>

            <Form.Column>
              <Form.Label
                text='País'
                id={'country'}
              />
              <Input.Root
                error={errors.country}
              >
                <Input.Icon
                  icon={<Flag />}
                />
                <Input.TextType
                  id={'country'}
                  placeholder={"Digite seu país"}
                  defaultValue={user.country}
                  {...register('country')}
                />
              </Input.Root>
            </Form.Column>


            <Form.Column>
              <Form.Label
                text='Estado'
                id={'state'}
              />
              <Input.Root
                error={errors.state}
              >
                <Input.Icon
                  icon={<Flag />}
                />
                <Input.TextType
                  id={'state'}
                  placeholder={"Digite seu estado"}
                  defaultValue={user.state}
                  {...register('state')}
                />
              </Input.Root>
            </Form.Column>

            <Form.Column>
              <Form.Label
                text='Cidade'
                id={'city'}
              />
              <Input.Root
                error={errors.city}
              >
                <Input.Icon
                  icon={<Flag />}
                />
                <Input.TextType
                  id={'city'}
                  placeholder={"Digite sua cidade"}
                  defaultValue={user.city}
                  {...register('city')}
                />
              </Input.Root>

            </Form.Column>

          </Form.Row>

        </Form.Content>


        <Form.ButtonSubmit
          sizeW="small"
        >
          <p>Salvar</p>
        </Form.ButtonSubmit>


      </Form.Root>
    </section>
  );
};

export default ProfileSection;
