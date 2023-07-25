import P from 'prop-types';

import * as F from './styles.module.css';
import Questions from './Questions';

const FaqModal = ({ contentData }) => {

  const { title } = contentData;

  return (
    <section className={F.content}>

      <header>
        <h1>{title}</h1>
      </header>

      <Questions />

    </section>
  );
};

FaqModal.propTypes = {
  contentData: P.shape({
    title: P.string,
  }).isRequired
}

export default FaqModal;
