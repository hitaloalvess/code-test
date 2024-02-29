import P from 'prop-types';

import * as L from './styles.module.css';

const LedLight = ({ active, color, opacity }) => {
  return (
    <div className={L.ledLightContainer}>
      {active && (
        <svg className={L.ledLightElement} style={{ fill: `${color}`, fillOpacity: `${opacity}` }} viewBox="0 0 51 74"
          xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="25.5" cy="68" rx="7.6" ry="4.1" />
          <path
            d="M25 62.5L1.5 23.8L3 26L3.60233 26.85L4.80116 28.1L6 29.2L7.75 30.5L9.5 31.65L11.25 32.5L13 33.28L14.75 33.9L16.5 34.43L18.5 34.86L19.75 35.12L21 35.2557L23 35.43L25 35.5L26.75 35.45L28.5 35.34L30.25 35.12L32 34.82L34.5 34.25L37 33.47L40 32.2L42 31.1L43 30.43L44 29.72L45.5 28.5L47 26.87L25 62.5Z" />
          <path
            d="M50.5 18C50.5 27.9411 38.8071 35.5 25 35.5C11.1929 35.5 0 27.4411 0 17.5C0 7.55887 11.6929 0 25.5 0C39.3071 0 50.5 8.05887 50.5 18Z" />
        </svg>
      )}
    </div>
  );
};

LedLight.propTypes = {
  active: P.bool.isRequired,
  color: P.string.isRequired,
  opacity: P.number.isRequired
}

export default LedLight;
