import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { addNote } from './noteSlice'
import styles from './NoteForm.module.css'

const NoteForm = () => {
  const dispatch = useDispatch()

  // Estado local para el contenido de la nueva nota
  const [newNote, setNewNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Evitar notas vacías o solo con espacios
    if (!newNote.trim()) return

    // Objeto de nota enviado al backend
    const noteObject = {
      content: newNote,
      important: false,
    }

    // Enviar la nota al slice
    dispatch(addNote(noteObject))

    // Limpiar el input
    setNewNote('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Input para escribir la nota */}
      <input
        className={styles.input}
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Nueva nota"
      />

      {/* Botón para agregar */}
      <button className={styles.button} type="submit">
        Agregar
      </button>
    </form>
  )
}

export default NoteForm
