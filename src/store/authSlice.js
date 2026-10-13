import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { load, save } from '../utils/storage'
import { hashPassword } from '../utils/hash'

// Frontend-only auth: the "users table" lives in localStorage.
const readUsers = () => load('users', [])

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    const users = readUsers()
    const normalisedEmail = email.trim().toLowerCase()
    if (users.some((u) => u.email === normalisedEmail)) {
      return rejectWithValue('An account with this email already exists. Try logging in.')
    }
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalisedEmail,
      passwordHash: await hashPassword(password),
      joinedAt: new Date().toISOString(),
    }
    save('users', [...users, user])
    const { passwordHash: _omit, ...publicUser } = user
    return publicUser
  },
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    const user = readUsers().find((u) => u.email === email.trim().toLowerCase())
    if (!user || user.passwordHash !== (await hashPassword(password))) {
      return rejectWithValue('Email or password is incorrect.')
    }
    const { passwordHash: _omit, ...publicUser } = user
    return publicUser
  },
)

const initialState = {
  user: load('session', null),
  status: 'idle', // idle | loading | failed
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading'
      state.error = null
    }
    const fulfilled = (state, action) => {
      state.status = 'idle'
      state.user = action.payload
    }
    const rejected = (state, action) => {
      state.status = 'failed'
      state.error = action.payload ?? 'Something went wrong. Please try again.'
    }
    builder
      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilled)
      .addCase(registerUser.rejected, rejected)
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilled)
      .addCase(loginUser.rejected, rejected)
  },
})

export const { logout, clearAuthError } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsLoggedIn = (state) => Boolean(state.auth.user)
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer
