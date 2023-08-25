import P from 'prop-types';


import * as DI from './styles.module.css';

const DeviceInput = ({ data, className, children }) => {
  const { type, minValue, maxValue, step, defaultValue, onInput, onTransformValue } = data;

  return (
    <div className={`${className?.container ?
      [DI.container, ...className.container].join(' ') :
      DI.container}
    `}
    >
      <input
        className={`${className?.input ?
          className.input.join(' ') :
          ''
          }`}
        type={type}
        min={minValue}
        max={maxValue}
        step={step}
        defaultValue={defaultValue}
        onInput={onInput}
      />

      <div className={DI.showValue}>
        <p
          className={DI.inputValue}
        >
          {onTransformValue ? onTransformValue() : defaultValue}
        </p>

        {children}

      </div>
    </div>
  );
};


DeviceInput.propTypes = {
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
}

export default DeviceInput;
