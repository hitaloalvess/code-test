import P from 'prop-types';

import * as L from './styles.module.css';

const LaserLight = ({ active, opacity }) => {
  return (
    <div className={L.laserLightContainer}>
      {active && (
        <svg className={L.laserLightElement} style={{ fillOpacity: `${opacity}` }} viewBox="0 0 243 131"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M39.3808 16.1655L127.972 59.171L130.467 62.1185C137.247 70.1275 131.51 82.4001 121.017 82.3354L26.0204 32.3048L39.3808 16.1655Z"
            fill="#C62626" />
          <path
            d="M39.3922 28C42.1144 24.5 45.8922 14.5 36.8922 11C29.8922 12 19.8922 22.5 22.3921 33.5C25.3921 36 34.0224 34.904 39.3922 28Z"
            fill="#C62626" />
        </svg>
      )}
    </div>
  );
};

LaserLight.propTypes = {
  active: P.bool.isRequired,
  opacity: P.number.isRequired
}

export default LaserLight;
