import imgFaqButton from '@/assets/images/buttons/faq-button.svg';

import CircleButton from '../CircleButton';

const FaqButton = () => {

    const handleClick = () => {
        console.log('Habilitando faq');
    }

    return <CircleButton
        imgSrc={imgFaqButton}
        name={'faq'}
        handleClick={handleClick}
    />;
};

export default FaqButton;