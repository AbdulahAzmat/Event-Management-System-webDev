import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import eventsReducer from './eventsSlice'
import registrationsReducer from './registrationsSlice'
import toastReducer from './toastSlice'
import { save } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
    toast: toastReducer,
  },
})

// Save the logged-in user and their registrations to localStorage after every change,
// so they are still there after a page refresh.
store.subscribe(() => {
  const state = store.getState()
  save('session', state.auth.user)
  save('registrations', state.registrations.byUser)
})
