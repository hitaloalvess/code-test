import { Envelope, Lock } from '@phosphor-icons/react';

import { apiAuth } from '@/services/apiAuth'
import { useContextAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { Form } from '@/components/SharedComponents/Form';
import { Input } from '@/components/SharedComponents/Input';
import { InputPassword } from '@/components/SharedComponents/Input/InputPasswordType';

import * as A from '../styles.module.css';
import * as C from './styles.module.css';
import { toast } from 'react-toastify';

const CredentialsSection = () => {

  const { user, handleSignOut } = useContextAuth();
  const { enableModal, disableModal } = useModal();

  const handleUpdatePassword = () => {
    enableModal({
      typeContent: 'update-password',
      title: 'Alterar senha',
      handleConfirm: () => {
        disableModal('update-password');
      }
    })
  }

  const handleDeleteAccount = async () => {
    try {

      await apiAuth.delete(`/users/${user.id}`);
      toast.success('Conta deletada com sucesso');

      handleSignOut();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const handleClickBtnDeleteAccount = () => {
    enableModal({
      typeContent: 'confirmation',
      subtitle: 'Tem certeza que deseja excluir sua conta?',
      handleConfirm: async () => {

        await handleDeleteAccount();
        disableModal('confirmation');

      }
    })
  }

  return (
    <section id='credentials' className={A.sectionItem}>

      <div className={A.sectionHeader}>

        <h2>Minhas credenciais</h2>

        <button
          className={C.btnDeleteAccount}
          onClick={handleClickBtnDeleteAccount}
        >
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
