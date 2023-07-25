import imgSearchForm from '@/assets/images/buttons/search-form-button.svg';
import CircleButton from '@/components/Platform/CircleButton';

const SearchFormButton = () => {
  return <a
    href="https://forms.office.com/pages/responsepage.aspx?id=J9qWQouzuU6lIUZNyZbWIXy1pl49eodCvWgqbHbB3P9UMDNVVkNSU1ozOU9TSTUxQkpMSFIyMTE0QyQlQCN0PWcu"
    target='_blank' rel="noreferrer"
  >
    <CircleButton
      imgSrc={imgSearchForm}
      name={'searchForm'}
      title='Botão de formulário de pesquisa'
    />
  </a>
};

export default SearchFormButton;
