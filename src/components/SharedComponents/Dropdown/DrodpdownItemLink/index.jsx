import P from 'prop-types';
import { Link } from 'react-router-dom';

import * as DL from './styles.module.css';

const DropdownItemLink = ({ src, children }) => {
  return (
    <Link to={src}>
      <div
        className={DL.itemLink}
      >
        {children}
      </div>
    </Link>
  );
};

DropdownItemLink.propTypes = {
  src: P.string.isRequired,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default DropdownItemLink;
