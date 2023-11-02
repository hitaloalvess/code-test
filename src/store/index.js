import { createWithEqualityFn } from 'zustand/traditional';

import { createDevicesSlice } from './slices/devices.slice';
import { createFlowsSlice } from './slices/flows.slice';
import { createLinesSlice } from './slices/lines.slice';
import { createGlobalPlatformSlice } from './slices/globalPlatform.slice';

export const useStore = createWithEqualityFn((...p) => ({

  ...createGlobalPlatformSlice(...p),
  ...createDevicesSlice(...p),
  ...createLinesSlice(...p),
  ...createFlowsSlice(...p)
}), Object.is);
