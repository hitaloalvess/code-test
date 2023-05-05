import { memo } from "react";

import {
    devicePreviewBody
} from './styles.module.css';

const DevicePreview = ({ name, imgSrc }) => {
    return (
        <>
            <div className={devicePreviewBody}>
                <img
                    src={imgSrc}
                    alt={`Imagem do dispositivo ${name}`}
                    loading='lazy'
                />
            </div>

        </>
    );
};

export default memo(DevicePreview);