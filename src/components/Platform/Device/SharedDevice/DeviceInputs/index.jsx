import P from 'prop-types';

import DeviceInput from "./DeviceInput";

import * as DI from './styles.module.css';

const DeviceInputs = ({ inputs }) => {
  return (
    <div
      className={DI.container}
      style={{ top: `-${inputs.length * 32}px` }}
    >

      {inputs.map((input, index) => (
        <DeviceInput
          key={index}
          data={input.data}
          className={input.className}
        >
          {input.children}
        </DeviceInput>
      ))}

    </div>
  );
};

DeviceInputs.propTypes = {
  inputs: P.arrayOf(
    P.shape({
      data: P.shape({
        type: P.string,
        minValue: P.oneOfType([P.number, P.string]),
        maxValue: P.oneOfType([P.number, P.string]),
        step: P.oneOfType([P.number, P.string]),
        defaultValue: P.oneOfType([P.number, P.string]),
        onInput: P.func.isRequired,
        onTransformValue: P.func
      }).isRequired,
      className: P.object,
      children: P.oneOfType([
        P.element,
        P.arrayOf(P.element)
      ])
    })
  )
}

export default DeviceInputs;
