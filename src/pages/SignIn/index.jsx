import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Envelope, Lock } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useContextAuth } from '@/hooks/useAuth';
import LogoMicrodigo from '@/assets/images/logo-microdigo.svg';
import { Input } from '@/components/Input';
import { InputPassword } from '@/components/Input/InputPasswordType';
import Banner from '@/components/Banner';
import { Form } from '@/components/Form'
import { SpinnerLoader } from '@/components/SpinnerLoader';

import * as S from './styles.module.css';

const signInSchema = z.object({
  email: z.string().email('Por favor, informe um email válido.'),
  password: z.string().min(4, { message: 'Por favor, insira uma senha válida.' })
}).required();

const SignIn = () => {
  const navigate = useNavigate();
  const { handleSignIn, isAuthenticated, isLoading } = useContextAuth();

  const [hasCompletedFields, setHasCompletedFields] = useState(true);

  const isFirstRender = useRef(true);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch
  } = useForm({
    shouldFocusError: false,
    resolver: zodResolver(signInSchema)
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/platform');
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const emailField = !!watch('email');
    const passwordField = !!watch('password')

    setHasCompletedFields(emailField && passwordField ? false : true)

  }, [watch('email'), watch('password')])


  const handleSubmitForm = async ({ email, password }) => {
    await handleSignIn({ email, password });
  }

  return (
    <main className={S.container}>
      <div className={S.content}>

        <header className={S.header}>
          <img src={LogoMicrodigo} alt="Logo microdigo" />
        </header>

        <div className={S.formContainer}>
          <Form.Root onSubmit={handleSubmit(handleSubmitForm)}>
            <>
              <Form.Title text={'Login'} />

              <Form.Content>
                <>
                  <Form.Row>
                    <Input.Root
                      error={errors.email}
                    >
                      <>
                        <Input.Icon
                          icon={<Envelope fontSize={20} color='var(--gray-100)' />}
                        />
                        <Input.TextType
                          placeholder={"Email"}
                          {...register('email')}
                        />
                      </>
                    </Input.Root>
                  </Form.Row>

                  <Form.Row>
                    <Input.Root
                      error={errors.password}
                    >
                      <Input.Icon icon={<Lock fontSize={20} className='text-gray-100' />} />
                      <Input.PasswordType
                        placeholder={"Senha"}
                        {...register('password')}
                      >
                        <InputPassword.Icon />
                      </Input.PasswordType>
                    </Input.Root>
                  </Form.Row>
                </>
              </Form.Content>

              <Form.ButtonSubmit disabled={hasCompletedFields} >
                {isLoading ?
                  (<SpinnerLoader.Icon />) :
                  <p>Entrar</p>
                }
              </Form.ButtonSubmit>
            </>
          </Form.Root>

          <div className={S.linkSignupContainer}>

            <p>Não tem uma conta?</p>

            <Link to={'/signup'}>
              <span className={S.linkSignup}>
                Cadastre-se
              </span>
            </Link>
          </div>

        </div>
      </div>

      <Banner />
    </main>
  );
};

export default SignIn;
