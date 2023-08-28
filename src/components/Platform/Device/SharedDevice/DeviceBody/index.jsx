import { forwardRef } from 'react';
import P from 'prop-types';

import * as DB from './styles.module.css';

const DeviceBody = forwardRef(function DeviceBody(
  { name = 'Device', imgSrc, onChangeActBtns, children, ...rest }, ref
) {
  return (
    <div
      className={DB.deviceBody}
      ref={ref}
      onMouseEnter={() => onChangeActBtns(true)}
      onMouseLeave={() => onChangeActBtns(false)}
      {...rest}
    >

      <img
        src={imgSrc}
        alt={`Device ${name}`}
        loading='lazy'
      />

      {children}

    </div>
  );
});

DeviceBody.propTypes = {
  name: P.string,
  imgSrc: P.string.isRequired,
  onChangeActBtns: P.func.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element)
  ])
}

export default DeviceBody;
