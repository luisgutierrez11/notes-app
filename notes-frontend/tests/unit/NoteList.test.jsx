// Herramientas de testing para renderizado y eventos.
import { render, screen, fireEvent } from '@testing-library/react'

// Mocks de Redux.
import { mockDispatch, mockSelector } from '../__mocks__/react-redux'

// Componente a testear.
import NotesList from '../../src/features/notes/NoteList'

// Forzamos a react-redux a usar nuestros mocks.
vi.mock('react-redux', () => import('../__mocks__/react-redux'))

// Suite de pruebas para la lista de notas.
describe('<NotesList />', () => {
  
  // Antes de cada test limpiamos mocks.
  beforeEach(() => {
    mockDispatch.mockClear()
    mockSelector.mockClear()
  })

  // Test #1: verifica que las notas del estado se rendericen en pantalla.
  it('muestra las notas del estado', () => {
    // Simulamos el estado del store con dos notas.
    mockSelector.mockImplementation((selector) =>
      selector({
        notes: {
          items: [
            { id: 1, content: 'Primera nota', important: false, user: { username: 'luis' } },
            { id: 2, content: 'Segunda nota', important: true, user: { username: 'luis' } },
          ],
          status: 'succeeded',
          error: null,
        },
        filter: 'ALL',
        auth: { user: { username: 'luis' } },
      })
    )

    render(<NotesList />)

    // Confirmamos que ambas notas aparezcan.
    expect(screen.getByText(/primera nota/i)).toBeInTheDocument()
    expect(screen.getByText(/segunda nota/i)).toBeInTheDocument()
  })

  // Test #2: verifica que se despache updateNote al marcar una nota importante.
  it('despacha updateNote al hacer clic en "Marcar importante"', () => {
    mockSelector.mockImplementation((selector) =>
      selector({
        notes: {
          items: [{ id: 1, content: 'Una nota', important: false, user: { username: 'luis' } }],
          status: 'succeeded',
          error: null,
        },
        filter: 'ALL',
        auth: { user: { username: 'luis' } },
      })
    )

    render(<NotesList />)

    // Seleccionamos el botón de "Marcar importante".
    const button = screen.getByRole('button', { name: /marcar importante/i })
    fireEvent.click(button)

    // Verificamos que dispatch sea llamado.
    expect(mockDispatch).toHaveBeenCalled()
  })

  // Test #3: verifica el filtro de búsqueda dentro de la lista.
  it('filtra por texto de búsqueda', () => {
    mockSelector.mockImplementation((selector) =>
      selector({
        notes: {
          items: [
            { id: 1, content: 'Aprender React', important: true, user: { username: 'luis' } },
            { id: 2, content: 'Practicar Vitest', important: false, user: { username: 'luis' } },
          ],
          status: 'succeeded',
          error: null,
        },
        filter: 'ALL',
        auth: { user: { username: 'luis' } },
      })
    )

    render(<NotesList />)

    // Input del buscador.
    const input = screen.getByPlaceholderText(/buscar nota/i)

    // Buscamos "vitest".
    fireEvent.change(input, { target: { value: 'vitest' } })

    // La nota que no coincide debe desaparecer.
    expect(screen.queryByText(/aprender react/i)).not.toBeInTheDocument()

    // La nota que coincide debe seguir visible.
    expect(screen.getByText(/practicar vitest/i)).toBeInTheDocument()
  })
})
