import * as C from '@/styles/common.module.css';
import * as SF from './styles.module.css';

const SearchFormModal = () => {
  return (
    <section className={SF.content}>

      <h1 className={SF.title}>Está gostando?</h1>

      <div className={SF.texts}>
        <p> Obrigado por visitar o nosso site, você foi selecionado para participar de uma breve pesquisa de satisfação do cliente para nos informar como podemos melhorar sua experiência. </p>

        <p>Gostaríamos de receber seu feedback!</p>
      </div>

      <div
        className={SF.actions}
      >
        <a
          href="https://forms.office.com/pages/responsepage.aspx?id=J9qWQouzuU6lIUZNyZbWIXy1pl49eodCvWgqbHbB3P9UMDNVVkNSU1ozOU9TSTUxQkpMSFIyMTE0QyQlQCN0PWcu"
          target='_blank'
          className={`${C.btn} ${C.btnBlue}`}
          rel="noreferrer"
        >
          Responder pesquisa
        </a>

      </div>
    </section>
  );
};


export default SearchFormModal;
