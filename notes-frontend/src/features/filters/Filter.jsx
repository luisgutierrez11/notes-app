import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from './filterSlice'
import styles from './Filter.module.css'

const Filter = () => {
  const dispatch = useDispatch()

  // Obtiene del store el filtro actualmente seleccionado
  const filter = useSelector(state => state.filter)

  // Cambia el filtro global en Redux
  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter))
  }

  return (
    <div className={styles.container}>
      {/* Filtro: Todas las notas */}
      <button
        onClick={() => handleFilterChange('ALL')}
        disabled={filter === 'ALL'} // deshabilita si ya está seleccionado
        className={`${styles.button} ${filter === 'ALL' ? styles.active : ''}`}
      >
        Todas
      </button>

      {/* Filtro: Notas importantes */}
      <button
        data-testid='importante'
        onClick={() => handleFilterChange('IMPORTANT')}
        disabled={filter === 'IMPORTANT'}
        className={`${styles.button} ${filter === 'IMPORTANT' ? styles.active : ''}`}
      >
        Importantes
      </button>

      {/* Filtro: Notas no importantes */}
      <button
        onClick={() => handleFilterChange('NONIMPORTANT')}
        disabled={filter === 'NONIMPORTANT'}
        className={`${styles.button} ${filter === 'NONIMPORTANT' ? styles.active : ''}`}
      >
        No importantes
      </button>
    </div>
  )
}

export default Filter
