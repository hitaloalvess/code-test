import P from 'prop-types';

import FaqBtnImage from '@/assets/images/buttons/faq-button.svg';
import ManualBtnImage from '@/assets/images/buttons/manual-button.svg';

import * as I from './styles.module.css';

const InitialIntroPlatformModal = ({ contentData }) => {

  const { title } = contentData;

  return (
    <section className={I.content}>

      <h1>{title}</h1>

      <iframe
        src="https://www.youtube.com/embed/KwnIp1YjPz0"
        allowFullScreen
        width={'100%'}
        height={420}
        frameBorder='0'
      ></iframe>

      <div
        className={I.subtitle}
      >
        <p>Caso não queira ver o tutorial completo, a qualquer momento você poderá acessar o botão FAQ
          <span>
            <img
              className={I.subtitleImgIcon}
              src={FaqBtnImage}
              alt="Botão de faq"
            />
          </span>
        </p>

        <p>
          ou o manual completo da plataforma
          <span>
            <img
              className={I.subtitleImgIcon}
              src={ManualBtnImage}
              alt="Botão de manual"
            />
          </span>

          e tirar dúvidas específicas
        </p>

      </div>

    </section>
  );
};

InitialIntroPlatformModal.propTypes = {
  contentData: P.shape({
    title: P.string.isRequired
  }).isRequired
}

export default InitialIntroPlatformModal;
