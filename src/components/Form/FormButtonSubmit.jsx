import P from 'prop-types';

const FormButtonSubmit = ({ width, text, ...rest }) => {
  return (
    <button
      type='submit'
      className={`${width ? width : 'w-full'} py-3 flex justify-center items-center rounded bg-blue transition-all duration-300 hover:brightness-90 disabled:cursor-not-allowed disabled:bg-gray-100`}
      {...rest}
    >
      <p className='font-bold text-white'>
        {text}
      </p>
    </button>
  );
};

FormButtonSubmit.propTypes = {
  text: P.string.isRequired,
  width: P.string
}

export default FormButtonSubmit;
