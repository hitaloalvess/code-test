import P from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';

import { calcDistance, calcAngle } from '@/utils/line-functions';
import { line, lineRange, btnDeleteLine } from './styles.module.css';

const Line = ({ id, fromPos, toPos }) => {
  const lineRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (lineRef.current) {
      setHeight(lineRef.current.offsetHeight);
    }
  }, []);

  const dimensions = useMemo(() => {
    const width = calcDistance({
      x1: fromPos.x,
      y1: fromPos.y,
      x2: toPos.x,
      y2: toPos.y
    });

    const angle = calcAngle({
      x1: fromPos.x,
      y1: fromPos.y,
      x2: toPos.x,
      y2: toPos.y
    });

    const center = height / 2;

    return { width, angle, center }

  }, [fromPos, toPos, height]);

  return (
    <div
      ref={lineRef}
      className={line}
      style={{
        top: `${fromPos.y - dimensions.center}px`,
        left: `${fromPos.x}px`,
        width: `${dimensions.width}px`,
        transform: `rotate(${dimensions.angle}deg)`,
      }}
    >
      <div
        className={lineRange}
        id={id}
        style={{
          width: `${dimensions.width}px`,
        }}
      >
      </div>

      <button
        className={btnDeleteLine}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Excluir linha');
        }}
      >
        <FaTrashAlt />
      </button>
    </div>
  );
};

Line.propTypes = {
  id: P.string.isRequired,
  fromPos: P.shape({
    x: P.number.isRequired,
    y: P.number.isRequired
  }),
  toPos: P.shape({
    x: P.number.isRequired,
    y: P.number.isRequired
  })
}

export default Line;
