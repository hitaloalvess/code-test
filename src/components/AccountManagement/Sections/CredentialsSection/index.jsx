import { Envelope, Lock } from '@phosphor-icons/react';

import { useContextAuth } from '@/hooks/useAuth';
import { Form } from '@/components/Form';
import { Input } from '@/components/Input';
import { InputPassword } from '@/components/Input/InputPasswordType';

import * as A from '../styles.module.css';
import * as C from './styles.module.css';

const CredentialsSection = () => {

  const { user } = useContextAuth();

  return (
    <section id='credentials' className={A.sectionItem}>

      <div className={A.sectionHeader}>

        <h2>Minhas credenciais</h2>

        <button className={C.btnDeleteAccount}>
          Excluir conta
        </button>

      </div>

      <Form.Row>
        <Input.Root
        >
          <Input.Icon
            icon={<Envelope />}
          />
          <Input.TextType
            placeholder={"Email"}
            disabled={true}
            defaultValue={user.email}
          />
        </Input.Root>
      </Form.Row>


      <Form.Row >
        <Input.Root
        >
          <Input.Icon icon={<Lock />} />
          <Input.PasswordType
            placeholder={"Senha"}
            defaultValue={"xxxxxxxxx"}
            disabled
          >
            <InputPassword.Button
              text="Alterar"
              handleClick={() => console.log('Alterar senha')}
            />
          </Input.PasswordType>
        </Input.Root>

      </Form.Row>

    </section>
  );
};

export default CredentialsSection;
