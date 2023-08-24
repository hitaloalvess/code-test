import imgSearchForm from '@/assets/images/buttons/search-form-button.svg';
import CircleButton from '@/components/Platform/MoutingPanel/CircleButton';

const SearchFormButton = () => {
  return <a
    href="https://forms.office.com/r/f9n4zaS3pG"
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
