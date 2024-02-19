import P from 'prop-types';

import * as BDP from './styles.module.css';

const ButtonMenuDevicePhysical = ({ children, handleClick, ...rest }) => {

  return (
    <button
      className={BDP.btnMenuDevicePhysicalContainer}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  )
}

ButtonMenuDevicePhysical.propTypes = {
  handleClick: P.func.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default ButtonMenuDevicePhysical;
