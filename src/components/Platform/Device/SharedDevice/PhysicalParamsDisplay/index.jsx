import { WifiHigh, WifiSlash } from '@phosphor-icons/react';
import P from 'prop-types';

import * as PD from './styles.module.css';

const PhysicalParamsDisplay = ({ connectionState }) => {

  return (
    <div className={PD.paramsDisplayContainer}>

      {connectionState
        ? <WifiHigh fontSize={20} />
        : <WifiSlash fontSize={20} />
      }
    </div>
  )
}

PhysicalParamsDisplay.propTypes = {
  connectionState: P.bool.isRequired
}

export default PhysicalParamsDisplay;
