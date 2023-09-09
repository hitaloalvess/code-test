
export const createMoutingPanelSlice = (set) => ({
  moutingPanelRef: null,
  scale: 1,

  loadMoutingPanel: (refValue) => {
    set({ moutingPanelRef: refValue })
  },

  zoomChange: (value) => {
    set({ scale: value })
  },
})
