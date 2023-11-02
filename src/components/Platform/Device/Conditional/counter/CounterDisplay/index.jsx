import P from 'prop-types';
import { CaretUp } from '@phosphor-icons/react';

import * as CD from './styles.module.css';
import { useEffect, useState } from 'react';

const CounterDisplay = ({ value, onIncrease, onDecrease }) => {

  const [displayNumbers, setDisplayNumbers] = useState({});

  const handleNumbers = () => {

    let newDisplayValues;

    if (value <= 9) {
      newDisplayValues = {
        thousand: '0',
        hundred: '0',
        ten: '0',
        unit: `${value}`,
      }
    }

    const arrayValue = value.toString().split('');

    if (value > 9 && value <= 99) {

      newDisplayValues = {
        thousand: '0',
        hundred: '0',
        ten: arrayValue[0],
        unit: arrayValue[1],
      }
    }

    if (value > 99 && value <= 999) {

      newDisplayValues = {
        thousand: '0',
        hundred: arrayValue[0],
        ten: arrayValue[1],
        unit: arrayValue[2],
      }

    }

    if (value > 999) {
      newDisplayValues = {
        thousand: arrayValue[0],
        hundred: arrayValue[1],
        ten: arrayValue[2],
        unit: arrayValue[3],
      }
    }

    setDisplayNumbers(newDisplayValues);

  }

  useEffect(() => {
    handleNumbers();
  }, [value]);

  return (
    <>
      <div className={CD.BodyCounterNumbers}>
        <div>{displayNumbers.thousand}</div>
        <div>{displayNumbers.hundred}</div>
        <div>{displayNumbers.ten}</div>
        <div>{displayNumbers.unit}</div>
      </div>
      <div className={CD.BodyCounterButtons}>
        <button
          className={CD.counterButton}
          onClick={onIncrease}
        >

          <CaretUp fontSize={16} />
        </button>

        <button
          className={CD.counterButtonDecrease}
          onClick={onDecrease}
        >
          <CaretUp fontSize={16} />
        </button>

      </div>
    </>
  );
};

CounterDisplay.propTypes = {
  value: P.number.isRequired,
  onIncrease: P.func.isRequired,
  onDecrease: P.func.isRequired
}
export default CounterDisplay;
