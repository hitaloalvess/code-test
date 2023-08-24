import P from 'prop-types';

import * as C from './styles.module.css';
import { useMemo } from 'react';

const ConnectorsContainer = ({ typeContainer, children }) => {

  const currentType = useMemo(() => {
    const types = {
      'entrys': C.entry,
      'exits': C.exit,
      'doubleType': C.twoConn
    }

    return types[typeContainer] || '';
  }, [typeContainer]);

  return (
    <div className={`${C.container} ${currentType}`}>
      {children}
    </div>
  );
};

ConnectorsContainer.propTypes = {
  typeContainer: P.oneOf(['entrys', 'exits', 'doubleType']),
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
  ])
}
export default ConnectorsContainer;
