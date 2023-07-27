import P from 'prop-types';

import * as DI from './styles.module.css';

const DropdownItem = ({ children }) => {
  return (
    <li className={DI.itemContainer}>
      {children}
    </li>
  );
};

DropdownItem.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}


export default DropdownItem;
