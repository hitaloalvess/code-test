import P from 'prop-types';
import ManualButton from '@/assets/images/buttons/manual-button.svg';

import * as C from '@/styles/common.module.css';
import * as T from './styles.module.css';

const TermsOfUseModal = ({ contentData }) => {

  const { closeModal } = contentData;

  return (
    <section
      className={T.content}
    >
      <h1 className={T.title}>Hey Maker, hello world!</h1>

      <div className={T.textsContainer}>
        <p>
          {`Sempre que começamos uma tecnologia ou código novo iniciamos com "hello world" (Olá mundo) e você está próximo de começar a desbravar esse novo universo do conhecimento!`}
        </p>

        <p>{`Este é um recurso experimental gratuito, que não coleta dados durante o seu uso e que funciona exclusivamente para navegadores de computadores (sugerimos o Google Chrome na versão mais atual).`}</p>

        <p>
          {`Você está contribuindo para testar a Microdigo, a plataforma de programação por fluxo lógico da Digo Maker, que vai ajudar diversos estudantes a aprenderem programação, matemática e tecnologia de forma prática!`}
        </p>

        <p>
          {`Caso tenha dúvidas, você pode acessar o manual online clicando no botão`}
          <img
            className={T.imgIconText}
            src={ManualButton}
            alt='Botão de abrir formulário '
          />
          {`.`}
        </p>
      </div>

      <div className={T.actionsContainer}>
        <button
          className={`${C.btn} ${C.btnBlue}`}
          onClick={closeModal}
        >
          Continuar
        </button>
      </div>
    </section>
  );
};

TermsOfUseModal.propTypes = {
  contentData: P.shape({
    closeModal: P.func.isRequired,
  }).isRequired
}

export default TermsOfUseModal;
