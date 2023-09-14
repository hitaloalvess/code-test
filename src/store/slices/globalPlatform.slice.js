
export const createGlobalPlatformSlice = (set) => ({
  platformContainerRef: null,
  scale: 1,

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
  }
})
