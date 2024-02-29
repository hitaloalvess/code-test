import { memo } from "react";
import P from 'prop-types';

import {
  devicePreviewBody
} from './styles.module.css';

const DevicePreview = memo(function DevicePreview({ name, imgSrc }) {
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
});

DevicePreview.propTypes = {
  name: P.string,
  imgSrc: P.string
}

export default DevicePreview;
