import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import notesService from '../../services/noteService'

// === Thunks asincrónicos ===

// Obtener todas las notas desde el backend
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
   return await notesService.getAll()
})

// Agregar una nota nueva
export const addNote = createAsyncThunk('notes/addNote', async (note) => {
  return await notesService.create(note)
})

// Actualizar una nota existente (cambia contenido o importancia)
export const updateNote = createAsyncThunk('notes/updateNote', async (note) => {
  return await notesService.update(note.id, note)
})

// Eliminar una nota por ID
export const deleteNote = createAsyncThunk('notes/deleteNote', async (id) => {
  return await notesService.remove(id)
})

// === Slice principal ===
const noteSlice = createSlice({
  name: 'notes',
  initialState: {
    items: [],      // Lista de notas
    status: 'idle', // Estado de carga
    error: null     // Mensaje de error
  },
  reducers: {
    // Limpia las notas (útil al cerrar sesión)
    clearNotes(state) {
      state.items = []
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
  builder
    // 🔹 GET
    .addCase(fetchNotes.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(fetchNotes.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.items = action.payload
    })
    .addCase(fetchNotes.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
    // 🔹 POST
    .addCase(addNote.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(addNote.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.items.push(action.payload)
    })
    .addCase(addNote.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
    // 🔹 PUT
    .addCase(updateNote.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(updateNote.fulfilled, (state, action) => {
      state.status = 'succeeded'
      const updatedNote = action.payload
      const index = state.items.findIndex(n => n.id === updatedNote.id)
      if (index !== -1) state.items[index] = updatedNote
    })
    .addCase(updateNote.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
    // 🔹 DELETE
    .addCase(deleteNote.pending, (state) => {
      state.status = 'loading'
    })
    .addCase(deleteNote.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.items = state.items.filter(note => note.id !== action.meta.arg)
    })
    .addCase(deleteNote.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
}

})

export const { clearNotes } = noteSlice.actions
export default noteSlice.reducer
