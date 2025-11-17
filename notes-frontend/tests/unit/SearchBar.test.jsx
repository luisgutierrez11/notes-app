import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from '../../src/components/SearchBar'

describe('<SearchBar />', () => {
  it('llama a onSearch con el texto ingresado', () => {
    // Mock de la función que recibe el texto de búsqueda
    const onSearch = vi.fn()

    // Renderizamos la barra de búsqueda pasándole el callback mock
    render(<SearchBar onSearch={onSearch} />)

    // Obtenemos el input por su placeholder
    const input = screen.getByPlaceholderText(/buscar nota/i)

    // Simulamos escribir en el input
    fireEvent.change(input, { target: { value: 'react' } })

    // Verifica que la función haya sido llamada con el texto ingresado
    expect(onSearch).toHaveBeenCalledWith('react')

    // Verifica que el valor del input se haya actualizado
    expect(input.value).toBe('react')
  })
})
