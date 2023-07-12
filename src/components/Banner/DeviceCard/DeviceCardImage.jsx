import P from 'prop-types';

const DeviceCardImage = ({ imgSrc }) => {
  return (
    <img
      className='w-full h-full'
      src={imgSrc}
      alt="Imagem de um dispositivo microdigo"
    />
  );
};

DeviceCardImage.propTypes = {
  imgSrc: P.string.isRequired,
}
export default DeviceCardImage;
