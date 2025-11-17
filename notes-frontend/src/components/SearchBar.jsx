import { useState } from 'react'
import styles from './SearchBar.module.css'

// Barra de búsqueda que recibe una función `onSearch`
// para enviar el texto ingresado al componente padre.
const SearchBar = ({ onSearch }) => {
  // Estado local para manejar el valor del input
  const [query, setQuery] = useState('')

  // Se ejecuta cada vez que el usuario escribe
  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)   // Actualiza el estado local
    onSearch(value)   // Envía el valor al componente padre
  }

  return (
    <input
      type="text"
      placeholder="Buscar nota..."
      value={query}
      onChange={handleChange} // Maneja el cambio en el input
      className={styles.input}
    />
  )
}

export default SearchBar
