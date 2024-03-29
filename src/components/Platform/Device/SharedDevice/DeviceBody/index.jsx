import { Children, forwardRef, useMemo, useState } from 'react';
import P from 'prop-types';

import ActionButtons from '../ActionButtons'

import * as DB from './styles.module.css';

const DeviceBody = forwardRef(function DeviceBody(
  { name = 'Device', imgSrc, classesForBody=[], classesForImg = [], children, ...rest }, ref
) {

  const [activeActBtns, setActiveActBtns] = useState(false);

  const handleActBtns = (value) => {
    setActiveActBtns(value)
  };

  const { actionButtonsChildren, othersChildren } = useMemo(() => {
    let actionButtonsChildren = null;

    const othersChildren = Children.map(children, child => {
      if (child.type !== ActionButtons) {
        return child;
      } else {
        actionButtonsChildren = child;
      }
    });

    return { actionButtonsChildren, othersChildren }

  }, [children]);


  return (
    <div
      className={`${DB.deviceBody} ${classesForBody.join(' ')}`}
      ref={ref}
      onMouseEnter={() => handleActBtns(true)}
      onMouseLeave={() => handleActBtns(false)}
      {...rest}
    >

      <img
        src={imgSrc}
        alt={`Device ${name}`}
        loading='lazy'
        className={classesForImg}
      />

      {othersChildren}

      {
        activeActBtns && (actionButtonsChildren)
      }

    </div>
  );
});

DeviceBody.propTypes = {
  name: P.string,
  imgSrc: P.string.isRequired,
  classesForImg: P.string,
  classesForBody: P.arrayOf(P.string),
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element)
  ])
}

export default DeviceBody;
