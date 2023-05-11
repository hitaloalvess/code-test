import { useCallback } from 'react';
import { useDrop } from 'react-dnd';

import { useFlow } from '@/hooks/useFlow';

import { lines } from './styles.module.css';

const calcDelta = ({ x1, y1, x2, y2 }) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;

  return [deltaX, deltaY];
}
const calcAngle = ({ x1, y1, x2, y2 }) => {
  const [deltaX, deltaY] = calcDelta({ x1, y1, x2, y2 });
  return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
}

const calcDistance = ({ x1, y1, x2, y2 }) => {
  const [deltaX, deltaY] = calcDelta({ x1, y1, x2, y2 });
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

const LinesContainer = () => {
  const {
    flowTemp,
    connectionLines,
    deleteLine,
    updateLines
  } = useFlow();

  const handleMouseMove = useCallback(({ mousePosX, mousePosY }) => {
    if (!flowTemp.connectorClicked) return;

    const { currentLine, from } = flowTemp;

    updateLines([
      {
        id: currentLine.id,
        fromPos: {
          x: from.connectorPos.x,
          y: from.connectorPos.y
        },
        toPos: {
          x: mousePosX,
          y: mousePosY
        }
      }
    ]);
  }, [flowTemp, updateLines]);

  // eslint-disable-next-line no-unused-vars
  const [_, drop] = useDrop(() => ({
    accept: ['connector'],
    hover: (item, monitor) => {
      const { x: mousePosX, y: mousePosY } = monitor.getClientOffset();

      handleMouseMove({
        mousePosX,
        mousePosY
      });
    },
    drop: () => {
      deleteLine({
        id: flowTemp.currentLine.id
      });
    }
  }), [flowTemp]);


  return (
    <div
      id={lines}
      ref={drop}
    >
      {connectionLines.map(({ id, fromPos, toPos }) => (
        <div
          key={id}
          className='lineRange'
          id={id}
          style={{
            height: '30px',
            backgroundColor: '#ffeeee00',
          }}
        >
          <div
            style={{
              height: '6px',
              backgroundColor: 'red',
              position: 'absolute',
              top: `${fromPos.y}px`,
              left: `${fromPos.x}px`,
              width: `${calcDistance({
                x1: fromPos.x,
                y1: fromPos.y,
                x2: toPos.x,
                y2: toPos.y
              })}px`,
              transform: `rotate(${calcAngle({
                x1: fromPos.x,
                y1: fromPos.y,
                x2: toPos.x,
                y2: toPos.y
              })}deg)`,
              transformOrigin: 'center left'
            }}
            onClick={() => console.log('Cliquei na linha')}
          >
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinesContainer;
