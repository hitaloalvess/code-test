import P from 'prop-types';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { calcDistance, calcAngle } from '@/utils/line-functions';
import { line, lineRange } from './styles.module.css';
import ButtonDeleteLine from '../ButtonDeleteLine';


const Line = memo(function Line(
  { id, fromPos, toPos, idConnection = '' }
) {

  const lineRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [disableBtnDelete, setDisableBtnDelete] = useState(true);


  const { scale } = useStore(store => ({
    scale: store.scale
  }), shallow);


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

    const topPos = fromPos.y - center;
    const leftPos = fromPos.x;

    return { width, angle, center, topPos, leftPos };

  }, [fromPos, toPos, height]);


  const handleDisableBtnDelete = () => {
    setDisableBtnDelete(prev => !prev);
  }

  return (
    <div
      ref={lineRef}
      className={line}
      style={{
        top: `${dimensions.topPos}px`,
        left: `${dimensions.leftPos}px`,
        width: `${dimensions.width}px`,
        transform: `rotate(${dimensions.angle}deg)`,
        height: `${6 * scale}px`
      }}
      onClick={() => handleDisableBtnDelete()}
    >
      <div
        className={lineRange}
        id={id}
        style={{
          width: `${dimensions.width}px`,
        }}
      >
      </div>

      {!disableBtnDelete && (
        <ButtonDeleteLine
          data={{
            idConnection: idConnection,
            idLine: id
          }}
        />
      )}
    </div>
  );
});

Line.propTypes = {
  id: P.string.isRequired,
  idConnection: P.string,
  fromPos: P.shape({
    x: P.number.isRequired,
    y: P.number.isRequired
  }),
  toPos: P.shape({
    x: P.number.isRequired,
    y: P.number.isRequired
  }),
  children: P.oneOfType([
    P.object,
    P.element,
    P.arrayOf(P.element)
  ])
}

export default Line;
