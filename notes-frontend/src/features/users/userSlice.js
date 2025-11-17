import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../../services/userService'
// Slice encargado del registro de usuarios (signup). Maneja estado de carga
// y errores asociados al proceso de registro.

// ---- Thunk: Registrar usuario ----
// Se usa rejectWithValue para devolver mensajes de error personalizados
export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Llamado al servicio que hace POST al backend
      const user = await userService.register(userData)
      return user
    } catch (err) {
      // Si el backend devuelve un error, lo enviamos como payload
      return rejectWithValue(err.response.data.error || 'Error al registrar usuario')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,    // Guarda errores de registro
  },
  reducers: {
    // Reinicia el estado del registro (útil luego de mostrar mensajes)
    resetStatus: (state) => {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 PETICIÓN INICIADA
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
      })
      // 🔹 PETICIÓN EXITOSA
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      // 🔹 PETICIÓN FALLIDA
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { resetStatus } = userSlice.actions
export default userSlice.reducer
