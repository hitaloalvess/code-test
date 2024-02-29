import P from 'prop-types';

const InputIcon = ({ icon }) => {
  return (
  <>{ icon }</>
  );
};

InputIcon.propTypes = {
  icon: P.element.isRequired
}

export default InputIcon;
