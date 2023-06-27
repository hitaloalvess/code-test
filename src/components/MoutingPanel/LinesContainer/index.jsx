import { useDrop } from 'react-dnd';

import { useFlow } from '@/hooks/useFlow';
import Line from './Line';

import { lines } from './styles.module.css';

const LinesContainer = () => {
  const {
    flowTemp,
    connectionLines,
    deleteLine,
    updateLines,
    deleteConnection
  } = useFlow();

  const handleMouseMove = ({ mousePosX, mousePosY }) => {
    if (!flowTemp.connectorClicked) return;

    const { currentLine, from } = flowTemp;

    const scrollLeft = document.documentElement.scrollLeft;
    const scrollTop = document.documentElement.scrollTop;

    updateLines({
      lineId: currentLine.id,
      newData: {
        id: currentLine.id,
        fromPos: {
          x: from.connector.x,
          y: from.connector.y
        },
        toPos: {
          x: mousePosX + scrollLeft,
          y: mousePosY + scrollTop
        }
      }
    });
  };

  // eslint-disable-next-line no-unused-vars
  const [_, drop] = useDrop(() => ({
    accept: ['connector'],
    hover: (_, monitor) => {
      const { x: mousePosX, y: mousePosY } = monitor.getClientOffset();

      handleMouseMove({
        mousePosX,
        mousePosY
      });
    },
    drop: () => deleteLine({ id: flowTemp.currentLine.id })

  }), [flowTemp]);

  return (
    <div
      id={lines}
      ref={drop}
    >
      {connectionLines.map(({ id, fromPos, toPos, idConnection }) => (
        <Line
          key={id}
          id={id}
          fromPos={fromPos}
          toPos={toPos}
          idConnection={idConnection}
          deleteLine={deleteConnection}
        />
      ))}
    </div>
  );
};

export default LinesContainer;
