import P from 'prop-types';

const InputRoot = ({ error, children }) => {
  return (
    <>
      <div className="relative  w-full h-[48px] flex gap-3 items-center px-6 rounded bg-white-200">
        {children}
      </div>

      {error && (
        <span
          className=' text-red mt-2'
        >
          {error.message}
        </span>
      )}

    </>
  );
};

InputRoot.propTypes = {
  error: P.object,
  children: P.element
}

export default InputRoot;
