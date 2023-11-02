import P from 'prop-types';

import * as BL from './styles.module.css';

const BargraphLights = ({ numActiveLights }) => {


  return (
    <ul className={BL.lights}>
      {Array.from(new Array(numActiveLights)).map((_, index) => (
        <li
          key={index}
          className={BL.ledLight}
        >
          <svg className={BL.ledLightElement}>
            <circle cx="2" cy="2" r="2" />
          </svg>
        </li>
      ))}
    </ul>
  );
};

BargraphLights.propTypes = {
  numActiveLights: P.number.isRequired
}

export default BargraphLights;
