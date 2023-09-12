import imgFaqButton from '@/assets/images/buttons/faq-button.svg';
import CircleButton from '../../CircleButton';

import { useModal } from '@/hooks/useModal';

const FaqButton = () => {
  const { enableModal, disableModal } = useModal();

  const handleClick = () => {
    enableModal({
      typeContent: 'faq',
      title: 'As pessoas também perguntam',
      handleConfirm: () => {
        disableModal('faq');
      }
    })
  }

  return <CircleButton
    imgSrc={imgFaqButton}
    name={'faq'}
    handleClick={handleClick}
    title='Botão de faq'
  />;
};

export default FaqButton;
