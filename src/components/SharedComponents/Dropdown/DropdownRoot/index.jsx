import P from 'prop-types';

import * as D from './styles.module.css';

const DropdownRoot = ({ orientation = 'left', children }) => {
  return (
    <div
      className={`${D.container} ${orientation === 'left' ? D.left : D.right}`}
    >
      <ul>{children}</ul>
    </div>
  );
};

DropdownRoot.propTypes = {
  orientation: P.oneOf(['left', 'right']),
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default DropdownRoot;
