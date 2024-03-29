import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { Cake, Flag, PhoneCall, User } from '@phosphor-icons/react';

import { updateAccount } from '@/api/http';
import { useContextAuth } from '@/hooks/useAuth';
import { isValidPhoneNumber, removeSpaces, removeSpecialCharacters } from '@/utils/form-validation-functions';
import { Form } from '@/components/SharedComponents/Form';
import { Input } from '@/components/SharedComponents/Input';

import * as S from '../styles.module.css';


const signUpSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  phone: z.string().nonempty('Telefone é obrigatório'),
  genre: z.string().nonempty('Campo gênero é obrigatório'),
  birth: z.string().nonempty('Data é obrigatório').pipe(z.coerce.date()),
  country: z.string().nonempty('País é obrigatório'),
  district: z.string().nonempty('Estado é obrigatório'),
  city: z.string().nonempty('Cidade é obrigatório'),
})
  .refine(({ phone }) => isValidPhoneNumber(phone), {
    message: 'Telefone inválido',
    path: ['phone']
  });


const ProfileSection = () => {

  const { person, handleUpdatePerson } = useContextAuth();

  const { handleSubmit, register, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    shouldFocusError: false
  });

  const handleChangeValue = (nameField, value) => setValue(nameField, value, { shouldValidate: true })

  const handleSubmitForm = async (params) => {
    const transformPhone = removeSpaces(removeSpecialCharacters(params.phone));
    const transformNasc = new Date(params.birth);

    const formData = {
      // ...person,
      ...params,
      phone: transformPhone,
      birth: transformNasc
    }

    try {
      const { data } = await updateAccount({
        personType: person.type,
        personId: person.id,
        data: formData
      })
      handleUpdatePerson(data.person);
      toast.success('Usuário atualizado com sucesso!');

    } catch (error) {
      toast.error(error.message);
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
                defaultValue={person.name}
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
                defaultValue={person.user.cpf}
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
                defaultValue={person.phone}
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
                  options={['MASCULINO', 'FEMININO']}
                  defaultValue={person.genre}
                  hasIconSibling={false}
                  {...register('genre')}
                />
              </Input.Root>
            </Form.Column>


            <Form.Column>
              <Form.Label
                text='Data de nascimento'
                id={'birth'}
              />
              <Input.Root
                error={errors.birth}
              >
                <Input.Icon
                  icon={<Cake />}
                />
                <Input.DateType
                  id={'birth'}
                  defaultValue={person.birth}
                  {...register('birth')}
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
                  defaultValue={person.country}
                  {...register('country')}
                />
              </Input.Root>
            </Form.Column>


            <Form.Column>
              <Form.Label
                text='Estado'
                id={'district'}
              />
              <Input.Root
                error={errors.district}
              >
                <Input.Icon
                  icon={<Flag />}
                />
                <Input.TextType
                  id={'district'}
                  placeholder={"Digite seu estado"}
                  defaultValue={person.district}
                  {...register('district')}
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
                  defaultValue={person.city}
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
