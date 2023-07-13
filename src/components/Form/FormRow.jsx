
import P from 'prop-types';

const FormRow = ({ columns = 1, children }) => {
  return (
    <div className={`grid grid-cols-${columns}`}>
      {children}
    </div>
  );
};

FormRow.propTypes = {
  columns: P.number,
  children: P.element.isRequired
}

export default FormRow;
