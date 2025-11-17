import { configureStore } from '@reduxjs/toolkit'
import notesReducer from './features/notes/noteSlice'
import filterReducer from './features/filters/filterSlice'
import authReducer from './features/auth/authSlice'
import userSlice from './features/users/userSlice'

// Configuración principal del store de Redux
export const store = configureStore({
  reducer: {
    // Reducer que maneja las notas
    notes: notesReducer,

    // Maneja el filtro de notas ("todas" / "importantes")
    filter: filterReducer,

    // Maneja autenticación: login, logout, errores…
    auth: authReducer,

    // Maneja la creación de usuarios y su estado
    users: userSlice
  }
})
