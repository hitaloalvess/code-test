import { v4 as uuid } from 'uuid';

export const createLinesSlice = (set, get) => ({

  lines: {},

  createLine: ({ fromPos, toPos }) => {
    const newLine = {
      id: uuid(),
      fromPos,
      toPos
    };

    set((state) => ({
      lines: {
        ...state.lines,
        [newLine.id]: newLine
      }
    }));

    return newLine;
  },

  updateLines: ({ lineId, newData }) => {

    set((state) => ({
      lines: {
        ...state.lines,
        [lineId]: {
          ...state.lines[lineId],
          ...newData
        }
      }
    }))
  },

  deleteLine: (lineId) => {
    const { clearFlowTemp } = get();

    const { lines } = get();

    const newLines = { ...lines };


    delete newLines[lineId];


    set({ lines: newLines });
    clearFlowTemp();
  }
})
