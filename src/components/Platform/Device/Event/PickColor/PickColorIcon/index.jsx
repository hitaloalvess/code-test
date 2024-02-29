import P from 'prop-types';

import * as PI from './styles.module.css';

const PickColorIcon = ({ color }) => {
  return (
    <svg
      className={PI.dropPosition}
      width="60"
      height="75"
      viewBox="0 0 60 75"
      fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className=""
        d="M30 75C13.4375 75 0 62.4023 0 46.875C0 33.5156 20.3438 8.45215 26.0313 1.71387C26.9688 0.615234 28.3594 0 29.8594 0H30.1406C31.6406 0 33.0312 0.615234 33.9687 1.71387C39.6562 8.45215 60 33.5156 60 46.875C60 62.4023 46.5625 75 30 75ZM15 49.2188C15 47.9297 13.875 46.875 12.5 46.875C11.125 46.875 10 47.9297 10 49.2188C10 58.2861 17.8281 65.625 27.5 65.625C28.875 65.625 30 64.5703 30 63.2812C30 61.9922 28.875 60.9375 27.5 60.9375C20.5937 60.9375 15 55.6934 15 49.2188Z"
        fill={color}
      />
    </svg>
  );
};

PickColorIcon.propTypes = {
  color: P.string.isRequired
}

export default PickColorIcon;
