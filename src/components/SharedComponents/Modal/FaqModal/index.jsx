import P from 'prop-types';

import * as F from './styles.module.css';
import Questions from './Questions';

const FaqModal = ({ contentData }) => {

  const { title } = contentData;

  return (
    <section className={F.content}>

      <h1 className={F.title}>{title}</h1>

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
