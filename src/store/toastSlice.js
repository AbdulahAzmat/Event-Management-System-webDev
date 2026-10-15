import { createSlice } from '@reduxjs/toolkit'

// A single message shown at the bottom of the screen, e.g. "You're registered".
const toastSlice = createSlice({
  name: 'toast',
  initialState: { message: null, type: 'success', id: 0 },
  reducers: {
    showToast(state, action) {
      state.message = action.payload.message
      state.type = action.payload.type ?? 'success'
      state.id += 1 // lets the Toast component restart its timer
    },
    hideToast(state) {
      state.message = null
    },
  },
})

export const { showToast, hideToast } = toastSlice.actions
export default toastSlice.reducer
