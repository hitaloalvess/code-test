import P from 'prop-types';

import * as AI from './styles.module.css';

const AvatarIconContentText = ({ text }) => {
  return (
    <p className={AI.avatarIconText} >{text} </p>
  );
};

AvatarIconContentText.propTypes = {
  text: P.string.isRequired
}

export default AvatarIconContentText;
