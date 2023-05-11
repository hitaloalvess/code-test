import { useCallback } from 'react';
import { useDrop } from 'react-dnd';

import { useFlow } from '@/hooks/useFlow';

import Line from './Line';

import { lines } from './styles.module.css';

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
        <Line
          key={id}
          id={id}
          fromPos={fromPos}
          toPos={toPos}
        />
      ))}
    </div>
  );
};

export default LinesContainer;
