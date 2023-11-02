import imgManualButton from '@/assets/images/buttons/manual-button.svg';

import CircleButton from '..';

const ManualButton = () => {

  const handleClick = () => {
    window.open(`${import.meta.env.VITE_MANUAL_URL}`, "_blank");
  }

  return <CircleButton
    imgSrc={imgManualButton}
    name={'manual'}
    handleClick={handleClick}
    title='Botão de menu'
  />;
};

export default ManualButton;
