import { createWithEqualityFn } from 'zustand/traditional';

import { createDevicesSlice } from './slices/devices.slice';
import { createMoutingPanelSlice } from './slices/moutingPanel.slice';
import { createFlowsSlice } from './slices/flows.slice';
import { createLinesSlice } from './slices/lines.slice';

export const useStore = createWithEqualityFn((...p) => ({

  ...createMoutingPanelSlice(...p),
  ...createDevicesSlice(...p),
  ...createLinesSlice(...p),
  ...createFlowsSlice(...p)
}), Object.is);
