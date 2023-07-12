import P from 'prop-types';
import { twMerge } from 'tailwind-merge';

const DeviceCardRoot = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge("absolute w-[80px] h-[70px] p-3 rounded backdrop-blur-6 shadow-md bg-opacity-60", rest.className)}
    >
      {children}
    </div>
  );
};

DeviceCardRoot.propTypes = {
  children: P.element
}
export default DeviceCardRoot;
