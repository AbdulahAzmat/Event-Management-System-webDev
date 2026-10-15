import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { searchEvents } from '../api/ticketmaster'

export const EMPTY_FILTERS = {
  keyword: '',
  category: '',
  city: '',
  countryCode: '',
  startDate: '',
  endDate: '',
  sort: 'date,asc',
}

// Loads one page of events using the filters currently in the store.
export const fetchEvents = createAsyncThunk('events/fetchEvents', async (page, { getState }) => {
  return searchEvents(getState().events.filters, page)
})

// The "coming up" strip on the home page: the next few events, no filters.
export const fetchUpcoming = createAsyncThunk('events/fetchUpcoming', async () => {
  const result = await searchEvents(EMPTY_FILTERS, 0)
  return result.events.slice(0, 6)
})

const initialState = {
  list: [],
  page: 0,
  totalPages: 0,
  totalResults: 0,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  filters: EMPTY_FILTERS,

  upcoming: [],
  upcomingStatus: 'idle',
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = EMPTY_FILTERS
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload.events
        state.page = action.payload.page
        state.totalPages = action.payload.totalPages
        state.totalResults = action.payload.totalResults
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchUpcoming.pending, (state) => {
        state.upcomingStatus = 'loading'
      })
      .addCase(fetchUpcoming.fulfilled, (state, action) => {
        state.upcomingStatus = 'succeeded'
        state.upcoming = action.payload
      })
      .addCase(fetchUpcoming.rejected, (state) => {
        state.upcomingStatus = 'failed'
      })
  },
})

export const { setFilters, clearFilters } = eventsSlice.actions
export default eventsSlice.reducer
