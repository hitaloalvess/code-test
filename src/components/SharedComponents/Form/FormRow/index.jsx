import { useMemo } from 'react';
import P from 'prop-types';

import * as F from './styles.module.css';

const FormRow = ({ columns = 1, children, ...rest }) => {

  const columnsType = useMemo(() => {
    const selectedColumType = {
      1: 'rowCol1',
      2: 'rowCol2',
      3: 'rowCol3'
    }

    return selectedColumType[columns];

  }, [columns]);

  return (
    <div
      {...rest}
      className={`${F.row} ${F[columnsType]}`}
    >
      {children}
    </div>
  );
};

FormRow.propTypes = {
  columns: P.number,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default FormRow;
