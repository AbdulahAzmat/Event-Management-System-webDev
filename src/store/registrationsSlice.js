import { createSlice } from '@reduxjs/toolkit'
import { load } from '../utils/storage'

// Registrations are stored per user: { [userId]: [registration, ...] }
// Each registration keeps a copy of the event so My Events works without calling the API.
const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: {
    byUser: load('registrations', {}),
  },
  reducers: {
    registerForEvent(state, action) {
      const { userId, event } = action.payload
      const mine = state.byUser[userId] ?? []

      // Prevent duplicate registration.
      if (mine.some((r) => r.event.id === event.id)) return

      mine.push({ event, registeredAt: new Date().toISOString() })
      state.byUser[userId] = mine
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      const mine = state.byUser[userId] ?? []
      state.byUser[userId] = mine.filter((r) => r.event.id !== eventId)
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions

// All registrations for whoever is logged in.
export const selectMyRegistrations = (state) => {
  const user = state.auth.user
  return user ? (state.registrations.byUser[user.id] ?? []) : []
}

export default registrationsSlice.reducer
