import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import loginService from '../../services/loginService'
import noteService from '../../services/noteService'

// Thunk asíncrono para manejar el inicio de sesión.
// Realiza la petición al backend, guarda el usuario en localStorage
// y retorna el usuario logueado si todo sale bien.
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const user = await loginService.login(credentials)
    window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
    return user
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Error al iniciar sesión')
  }
})

// const userFromStorage = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))

const authSlice = createSlice({
  name: 'auth',
  // Estado inicial del slice: no hay usuario, y no hay solicitud en curso
  initialState: {
      user: null,
      status: 'idle',
      error: null,
  },
  reducers: {
    // Establece manualmente el usuario (usado cuando se carga desde localStorage)
    setUser(state, action) {
      state.user = action.payload
    },

    // Cierra sesión y elimina el usuario de localStorage
    logoutUser(state) {
      state.user = null
      window.localStorage.removeItem('loggedNoteAppUser')
    },
  },
  extraReducers: (builder) => {
    builder
      // Cuando loginUser está en proceso
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })

      // Cuando loginUser finaliza correctamente
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        noteService.setToken(action.payload.token)
      })

      // Cuando loginUser falla
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logoutUser, setUser } = authSlice.actions
export default authSlice.reducer
