import P from 'prop-types';

import * as AI from './styles.module.css';

const AvatarIconRoot = ({ handleClick, children }) => {
  return (
    <div
      className={AI.avatarIconContainer}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

AvatarIconRoot.propTypes = {
  handleClick: P.func.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default AvatarIconRoot;
