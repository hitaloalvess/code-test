import imgManualButton from '@/assets/images/buttons/manual-button.svg';

import CircleButton from '../CircleButton';

const ManualButton = () => {

  const handleClick = () => {
    window.open('https://microdigo-manual.vercel.app/', "_blank");
  }

  return <CircleButton
    imgSrc={imgManualButton}
    name={'manual'}
    handleClick={handleClick}
    title='Botão de menu'
  />;
};

export default ManualButton;
