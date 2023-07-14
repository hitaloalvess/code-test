
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Envelope,
  User,
  Lock,
  Phone,
  Cake,
  Flag
} from '@phosphor-icons/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LogoMicrodigo from '@/assets/images/logo-microdigo.svg';
import Banner from '@/components/Banner';

import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
import { isValidCPF, isValidPhoneNumber } from '@/utils/form-validation-functions';


const signUpSchema = z.object({
  name: z.string().nonempty('Nome é obrigatório'),
  email: z.string().email('Por favor, informe um email válido.'),
  password: z.string().min(8, { message: 'Por favor, insira uma senha válida.' }),
  confirm_password: z.string().min(8, { message: 'Por favor, insira uma senha válida' }),
  cpf: z.string().nonempty('Cpf é obrigatório'),
  phone: z.string().nonempty('Telefone é obrigatório'),
  genre: z.string().nonempty('Campo gênero é obrigatório'),
  date: z.string().nonempty('Data é obrigatório').pipe(z.coerce.date()),
  country: z.string().nonempty('País é obrigatório'),
  state: z.string().nonempty('Estado é obrigatório'),
  city: z.string().nonempty('Cidade é obrigatório'),
})
  .refine(({ password, confirm_password }) => password === confirm_password, {
    message: 'Senhas não conferem',
    path: ['confirm_password']
  })
  .refine(({ cpf }) => isValidCPF(cpf), {
    message: 'CPF inválido',
    path: ['cpf']
  })
  .refine(({ phone }) => isValidPhoneNumber(phone), {
    message: 'Telefone inválido',
    path: ['phone']
  });

const SignUp = () => {

  const { handleSubmit, register, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    shouldFocusError: false
  });

  const handleChangeValue = (nameField, value) => setValue(nameField, value, { shouldValidate: true })

  const handleSubmitForm = (data) => {
    console.log(data);
  }

  return (
    <main className='w-screen h-screen grid grid-cols-[1fr_420px] overflow-hidden'>

      <div className='w-full flex items-center flex-col py-[44px] px-[80px] gap-[44px] overflow-y-auto no-scrollbar'>

        <header className='relative w-full flex justify-center items-center'>

          <Link to={'/'} className='absolute left-0'>
            <ArrowLeft fontSize={24} className='text-gray-100 transition-all duration-[450ms] hover:text-blue hover:scale-110' />
          </Link>

          <div className="max-w-[200px]">
            <img src={LogoMicrodigo} alt="Logo microdigo" />
          </div>

        </header>


        <div className='w-full'>
          <Form.Root className='w-full' onSubmit={handleSubmit(handleSubmitForm)}>
            <Form.Title text={'Crie sua conta'} />

            <Form.Content>
              <Form.Row>
                <Input.Root
                  error={errors.name}
                >
                  <Input.Icon
                    icon={<User fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextType
                    placeholder={"Nome completo"}
                    {...register('name')}
                  />
                </Input.Root>
              </Form.Row>

              <Form.Row>
                <Input.Root
                  error={errors.email}
                >
                  <Input.Icon
                    icon={<Envelope fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextType
                    placeholder={"Email"}
                    {...register('email')}
                  />
                </Input.Root>
              </Form.Row>


              <Form.Row className='grid-cols-2 gap-x-6'>
                <Input.Root
                  error={errors.password}
                >
                  <Input.Icon icon={<Lock fontSize={20} className='text-gray-100' />} />
                  <Input.PasswordType
                    placeholder={"Senha"}
                    {...register('password')}
                  />
                </Input.Root>

                <Input.Root
                  error={errors.confirm_password}
                >
                  <Input.Icon icon={<Lock fontSize={20} className='text-gray-100' />} />
                  <Input.PasswordType
                    placeholder={"Confirmar Senha"}
                    {...register('confirm_password')}
                  />
                </Input.Root>
              </Form.Row>

              <Form.Row className='grid-cols-2 gap-6'>
                <Input.Root
                  error={errors.cpf}
                >
                  <Input.Icon
                    icon={<User fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextMaskType
                    placeholder={"Digite seu cpf"}
                    maskChange={handleChangeValue}
                    {...register('cpf')}
                  />
                </Input.Root>

                <Input.Root
                  error={errors.phone}
                >
                  <Input.Icon
                    icon={<Phone fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextMaskType
                    placeholder={"+55 (00) 00000-0000"}
                    maskChange={handleChangeValue}
                    {...register('phone')}
                  />
                </Input.Root>
              </Form.Row>


              <Form.Row className='grid-cols-2 gap-6'>
                <Input.Root
                  error={errors.genre}
                >

                  <Input.SelectType
                    defaultOptTxt='Selecione seu gênero'
                    options={['MASCULINO', 'FEMININO', 'OUTRO']}
                    hasIconSibling={false}
                    {...register('genre')}
                  />
                </Input.Root>

                <Input.Root
                  error={errors.date}
                >
                  <Input.Icon
                    icon={<Cake fontSize={20}
                      className={'text-gray-100'}
                    />}
                  />
                  <Input.DateType
                    {...register('date')}
                  />
                </Input.Root>

              </Form.Row>


              <Form.Row className='grid-cols-3 gap-6'>
                <Input.Root
                  error={errors.country}
                >
                  <Input.Icon
                    icon={<Flag fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextType
                    placeholder={"Digite seu país"}
                    {...register('country')}
                  />
                </Input.Root>


                <Input.Root
                  error={errors.state}
                >
                  <Input.Icon
                    icon={<Flag fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextType
                    placeholder={"Digite seu estado"}
                    {...register('state')}
                  />
                </Input.Root>

                <Input.Root
                  error={errors.city}
                >
                  <Input.Icon
                    icon={<Flag fontSize={20} className={'text-gray-100'} />}
                  />
                  <Input.TextType
                    placeholder={"Digite sua cidade"}
                    {...register('city')}
                  />
                </Input.Root>

              </Form.Row>

            </Form.Content>


            <Form.ButtonSubmit text="Cadastrar" />


          </Form.Root>
        </div>


      </div>

      <Banner />
    </main >
  );
};

export default SignUp;
