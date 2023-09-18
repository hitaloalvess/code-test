
export const createGlobalPlatformSlice = (set) => ({
  platformContainerRef: null,
  scale: 1,
  hasUpdate: false,

  loadPlatformContainer: (refValue) => {
    set({ platformContainerRef: refValue })
  },

  zoomChange: (value) => {
    set({ scale: value })
  },

  cleanMoutingPanel: () => {
    set({
      flows: {},
      devices: {},
      lines: {},
      flowTemp: {}
    })
  },

  changeHasUpdate: (value) => {
    set({ hasUpdate: value });
  }
})
