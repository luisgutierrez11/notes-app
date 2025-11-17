import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotes, updateNote, deleteNote } from './noteSlice'
import SearchBar from '../../components/SearchBar'
import styles from './NoteList.module.css'

const NotesList = () => {
  const dispatch = useDispatch()

  // Estado global de notas: lista, estado de carga y error
  const { items: notes = [], status, error } = useSelector(state => state.notes)

  // Filtro global seleccionado (ALL, IMPORTANT, NONIMPORTANT)
  const filter = useSelector(state => state.filter)

  const [searchQuery, setSearchQuery] = useState('')

  // Usuario autenticado (para permitir editar/eliminar solo sus notas)
  const { user } = useSelector(state => state.auth)

  // Cargar notas al montar el componente
  useEffect(() => {
    dispatch(fetchNotes())
  }, [dispatch])

  // Cambiar importancia de una nota
  const handleToggleImportance = (note) => {
    dispatch(updateNote({ ...note, important: !note.important }))
  }

  // Eliminar nota por ID
  const handleDelete = (id) => {
    dispatch(deleteNote(id))
  }

  /*
    === FILTRADO DE NOTAS ===
    1. Filtrar según la opción seleccionada (Redux)
    2. Filtrar por el texto ingresado en el buscador
  */

  const notesToShow =
    filter === 'ALL'
      ? notes
      : filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)

  const notesFilteredBySearch = notesToShow.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Estado de carga de notas */}
      {status === 'loading' && <p>Cargando notas...</p>}

      {/* Error al cargar notas */}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}

      {/* Barra de búsqueda */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Si no hay notas después de aplicar filtros */}
      {notesFilteredBySearch.length === 0 ? (
        <p className={styles.empty}>No hay notas para mostrar</p>
      ) : (
        <ul className={styles.list}>
          {notesFilteredBySearch.map(note => (
            <li key={note.id} className={`${styles.note} ${styles.fadeIn}`}>
              
              {/* Texto de la nota con estilo si es importante */}
              <span
                className={`${styles.text} ${note.important ? styles.important : ''}`}
              >
                {note.content}
              </span>

              {' '}

              {/* Botones solo visibles si la nota pertenece al usuario logueado */}
              {user && note.user && note.user.username === user.username && (
                <>
                  {/* Importancia */}
                  <button
                    className={`${styles.button} ${styles.buttonImportant}`}
                    onClick={() => handleToggleImportance(note)}
                  >
                    {note.important ? '⭐ Quitar importancia' : '☆ Marcar importante'}
                  </button>

                  {' '}

                  {/* Eliminar */}
                  <button
                    className={`${styles.button} ${styles.buttonDanger}`}
                    onClick={() => handleDelete(note.id)}
                  >
                    Eliminar
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NotesList
