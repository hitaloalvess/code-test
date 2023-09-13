import P from 'prop-types';

import * as L from './styles.module.css';

const LedMonoLight = ({ active, opacity }) => {
  return (
    <div className={L.ledMonoLightContainer}>
      {active && (
        <svg className={L.ledMonoLightElement} style={{ fillOpacity: `${opacity * 0.5}` }} viewBox="0 0 143 143"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M32.273 62.4038C32.1137 43.8898 46.8756 33.7997 61.6353 33.1042C77.2726 32.3675 92.884 43.8334 92.8871 62.1665C92.8931 105.403 93.6193 113.977 92.9704 122.874C84.96 141.895 37.3388 138.956 32.2677 123.39C31.4452 118.404 32.273 62.4038 32.273 62.4038Z"
            fill="white" />
          <path d="M132.899 71.5C132.899 90.5 115.967 128.5 72.035 128.5C28.1032 128.5 -7.60137 91.5 1.39863 51.5001C10.3986 11.5002 42.8986 0.000132132 72.035 7.60076e-10C122.899 -0.000230663 132.899 52.5 132.899 71.5Z"
            fill="white" />
        </svg>
      )}
    </div>
  );
};

LedMonoLight.propTypes = {
  active: P.bool.isRequired,
  opacity: P.number.isRequired
}

export default LedMonoLight;
