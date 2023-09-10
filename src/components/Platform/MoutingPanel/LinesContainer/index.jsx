import { memo } from 'react';
import { useDrop } from 'react-dnd';
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import Line from './Line';

import * as LC from './styles.module.css';


const LinesContainer = memo(function LinesContainer() {

  const {
    moutingPanelRef,
    flowTemp,
    lines,
    deleteLine,
    updateLines,
  } = useStore(store => ({
    moutingPanelRef: store.moutingPanelRef,
    flowTemp: store.flowTemp,
    lines: store.lines,
    deleteLine: store.deleteLine,
    updateLines: store.updateLines,
    deleteConnection: store.deleteConnection
  }), shallow)

  const handleMouseMove = ({ mousePosX, mousePosY }) => {

    if (!flowTemp.connectorClicked) return;

    const { currentLine, from } = flowTemp;

    const scrollLeft = moutingPanelRef.current.scrollLeft;
    const scrollTop = moutingPanelRef.current.scrollTop;

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
    drop: () => deleteLine(flowTemp.currentLine.id)

  }), [flowTemp]);

  return (
    <div
      className={LC.lines}
      ref={drop}
    >
      {Object.values(lines).map(({ id, fromPos, toPos, idConnection }) => (
        <Line
          key={id}
          id={id}
          fromPos={fromPos}
          toPos={toPos}
          idConnection={idConnection}
        />
      ))}
    </div>
  );
});

export default LinesContainer;
