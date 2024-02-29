import P from 'prop-types';

import * as DC from './styles.module.css';

const DeviceCardImage = ({ imgSrc }) => {
  return (
    <img
      className={DC.cardImage}
      src={imgSrc}
      alt="Imagem de um dispositivo microdigo"
    />
  );
};

DeviceCardImage.propTypes = {
  imgSrc: P.string.isRequired,
}
export default DeviceCardImage;
