import { createSlice } from '@reduxjs/toolkit'

/*
  Slice encargado de manejar el estado del filtro aplicado a las notas.
  El estado es simplemente un string con uno de los siguientes valores:
  'ALL', 'IMPORTANT' o 'NONIMPORTANT'.
*/

const filterSlice = createSlice({
  name: 'filter',

  // Filtro por defecto: mostrar todas las notas
  initialState: 'ALL',

  reducers: {
    // Reemplaza el estado por el nuevo filtro seleccionado
    setFilter: (state, action) => action.payload
  }
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer
