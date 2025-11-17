// Importamos utilidades para testear componentes React.
import { render, screen, fireEvent } from '@testing-library/react'

// Importamos los mocks de redux.
import { mockDispatch, mockSelector } from '../__mocks__/react-redux'

// Componente que se va a testear.
import NoteForm from '../../src/features/notes/NoteForm'

// Le decimos a Vitest que use nuestros mocks cuando alguien importe react-redux.
vi.mock('react-redux', () => import('../__mocks__/react-redux'))

// Comienza la suite de pruebas del formulario de notas.
describe('<NoteForm />', () => {
  
  // Antes de cada test reiniciamos el mock de dispatch y preparamos un estado por defecto.
  beforeEach(() => {
    mockDispatch.mockClear()

    // Simulamos un estado donde el usuario está logueado y no hay notas todavía.
    mockSelector.mockImplementation((selector) =>
      selector({
        user: { username: 'testuser' },
        notes: [],
      })
    )
  })

  // Test: verifica que se despacha la acción al agregar una nueva nota.
  it('despacha addNote con el contenido correcto', () => {
    render(<NoteForm />)

    // Obtenemos el input y el botón.
    const input = screen.getByPlaceholderText(/nueva nota/i)
    const button = screen.getByRole('button', { name: /agregar/i })

    // Simulamos escribir una nota y hacer clic.
    fireEvent.change(input, { target: { value: 'nota de prueba' } })
    fireEvent.click(button)

    // Verificamos que dispatch haya sido llamado.
    expect(mockDispatch).toHaveBeenCalled()
  })
})
