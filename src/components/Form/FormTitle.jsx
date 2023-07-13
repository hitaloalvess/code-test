import P from 'prop-types';

const FormTitle = ({ text }) => {
  return (
    <h1
      className='text-3xl'
    >
      {text}
    </h1>
  );
};

FormTitle.propTypes = {
  text: P.string.isRequired
}

export default FormTitle;
