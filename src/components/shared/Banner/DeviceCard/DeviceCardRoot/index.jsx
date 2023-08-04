import P from 'prop-types';

import * as DC from './styles.module.css';
import { useMemo } from 'react';

const DeviceCardRoot = ({ color = 'red', children, ...rest }) => {

  const type = useMemo(() => {
    const types = {
      red: 'cardContainerRed',
      blue: 'cardContainerBlue',
      yellow: 'cardContainerYellow',
    }

    return types[color];
  }, [color]);


  return (
    <div
      {...rest}
      className={`${DC.cardContainer} ${DC[type]}`}
    >
      {children}
    </div>
  );
};

DeviceCardRoot.propTypes = {
  color: P.string,
  children: P.element
}
export default DeviceCardRoot;
