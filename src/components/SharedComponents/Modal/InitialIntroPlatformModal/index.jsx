import { useState } from 'react';
import P from 'prop-types';

import FaqBtnImage from '@/assets/images/buttons/faq-button.svg';
import ManualBtnImage from '@/assets/images/buttons/manual-button.svg';
import { SpinnerLoader } from '@/components/SharedComponents/SpinnerLoader';

import * as I from './styles.module.css';

const InitialIntroPlatformModal = ({ contentData }) => {

  const { title } = contentData;

  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    setIsLoading(false);
  }

  return (
    <section className={I.content}>

      <h1>{title}</h1>

      <div className={I.videoContainer}>

        {isLoading && (
          <SpinnerLoader.Root>
            <SpinnerLoader.IconText text='Carregando...' />
          </SpinnerLoader.Root>
        )}

        <iframe
          src="https://www.youtube.com/embed/7Oa2LK9CFyc"
          allowFullScreen
          width={'100%'}
          height={420}
          frameBorder='0'
          onLoad={handleLoading}
        ></iframe>
      </div>

      <div
        className={I.subtitle}
      >
        <p>Caso não queira ver o tutorial completo agora, a qualquer momento você poderá acessar o botão FAQ
          <span>
            <img
              className={I.subtitleImgIcon}
              src={FaqBtnImage}
              alt="Botão de faq"
            />
          </span>
        </p>

        <p>
          ou o manual da plataforma
          <span>
            <img
              className={I.subtitleImgIcon}
              src={ManualBtnImage}
              alt="Botão de manual"
            />
          </span>

          e tirar dúvidas específicas.
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
