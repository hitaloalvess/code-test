import P from 'prop-types';

const InputRoot = ({ error, children }) => {
  return (
    <div className='flex flex-col gap-y-1'>
      <div className="relative  w-full h-[48px] flex gap-3 items-center px-6 rounded bg-white-200">
        {children}
      </div>

      {error && (
        <span
          className=' text-red'
        >
          {error.message}
        </span>
      )}

    </div>
  );
};

InputRoot.propTypes = {
  error: P.object,
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])

}

export default InputRoot;
