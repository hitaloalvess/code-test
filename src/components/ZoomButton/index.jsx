import imgZoomButton from '@/assets/images/buttons/zoom-button.svg';

import CircleButton from '../CircleButton';

const ZoomButton = () => {

    const handleClick = () => {
        console.log('Habilitando zoom');
    }

    return <CircleButton
        imgSrc={imgZoomButton}
        name={'zoom'}
        handleClick={handleClick}
    />;
};

export default ZoomButton;