
export const createGlobalPlatformSlice = (set) => ({
  scale: 1,
  hasProjectUpdate: false,
  platformRef: null,
  sidebarRef: null,

  loadRef: (key, refValue) => {
    set({ [key]: refValue })
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

  changeHasProjectUpdate: (value) => {
    set({ hasProjectUpdate: value });
  },

})
