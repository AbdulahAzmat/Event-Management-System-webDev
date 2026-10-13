import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { save } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Keep the logged-in session in localStorage so a refresh doesn't log you out.
let lastUser = store.getState().auth.user
store.subscribe(() => {
  const { user } = store.getState().auth
  if (user !== lastUser) {
    lastUser = user
    save('session', user)
  }
})
