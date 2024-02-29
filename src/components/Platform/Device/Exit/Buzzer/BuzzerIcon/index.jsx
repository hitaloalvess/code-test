import P from 'prop-types';

import * as B from './styles.module.css';
import { memo } from 'react';

const BuzzerIcon = memo(function BuzzerIcon({ active }) {

  return (
    <svg
      className={`${B.buzzerIcon} ${active ? B.buzzerIconOn : B.buzzerIconOff}`}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.4961 0.241341C19.8125 0.475691 20 0.850652 20 1.24514V4.05734V14.3688C20 16.0951 18.3203 17.4934 16.25 17.4934C14.1797 17.4934 12.5 16.0951 12.5 14.3688C12.5 12.6424 14.1797 11.2441 16.25 11.2441C16.6875 11.2441 17.1094 11.3066 17.5 11.4238V5.73686L7.5 8.73654V16.8685C7.5 18.5949 5.82031 19.9932 3.75 19.9932C1.67969 19.9932 0 18.5949 0 16.8685C0 15.1421 1.67969 13.7438 3.75 13.7438C4.1875 13.7438 4.60938 13.8063 5 13.9235V7.80695V4.99475C5 4.44402 5.36328 3.95579 5.89063 3.79565L18.3906 0.0460493C18.7695 -0.06722 19.1797 0.00308507 19.4961 0.241341Z"
        fill="#282832"
      />
    </svg>
  );
});

BuzzerIcon.propTypes = {
  active: P.bool.isRequired
}

export default BuzzerIcon;
