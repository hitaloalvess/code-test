import { Envelope, Lock } from '@phosphor-icons/react';

import { useContextAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
import { InputPassword } from '@/components/Input/InputPasswordType';

import * as A from '../styles.module.css';
import * as C from './styles.module.css';

const CredentialsSection = () => {

  const { user } = useContextAuth();
  const { enableModal, disableModal } = useModal();

  const handleUpdatePassword = () => {
    enableModal({
      typeContent: 'update-password',
      title: 'Alterar senha',
      handleConfirm: () => {
        disableModal();
      }
    })
  }

  return (
    <section id='credentials' className={A.sectionItem}>

      <div className={A.sectionHeader}>

        <h2>Minhas credenciais</h2>

        <button className={C.btnDeleteAccount}>
          Excluir conta
        </button>

      </div>

      <Form.Row>
        <Form.Label text='Email' id='email' />

        <Input.Root
        >
          <Input.Icon
            icon={<Envelope />}
          />
          <Input.TextType
            id='email'
            placeholder={"Email"}
            disabled={true}
            defaultValue={user.email}
          />
        </Input.Root>
      </Form.Row>


      <Form.Row >

        <Form.Label text='Senha' id='senha' />

        <Input.Root
        >
          <Input.Icon icon={<Lock />} />
          <Input.PasswordType
            id='senha'
            placeholder={"Senha"}
            defaultValue={"xxxxxxxxx"}
            disabled
          >
            <InputPassword.Button
              text="Alterar"
              handleClick={handleUpdatePassword}
            />
          </Input.PasswordType>
        </Input.Root>

      </Form.Row>

    </section>
  );
};

export default CredentialsSection;
