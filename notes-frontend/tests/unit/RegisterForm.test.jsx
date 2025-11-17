import { render, screen, fireEvent } from '@testing-library/react'
import { mockDispatch, mockSelector } from '../__mocks__/react-redux'
import RegisterForm from '../../src/features/auth/RegisterForm'

// Mockeamos react-redux para usar nuestro mockDispatch y mockSelector
vi.mock('react-redux', () => import('../__mocks__/react-redux'))

describe('<RegisterForm />', () => {
  // Mock de la función que cambia entre login/register
  const showRegisterMock = vi.fn()

  beforeEach(() => {
    // Limpia los mocks antes de cada test
    mockDispatch.mockClear()

    // Simulamos un estado inicial del slice `users`
    mockSelector.mockImplementation((selector) =>
      selector({ users: { status: 'idle', error: null } })
    )
  })

  it('envía los datos del formulario y despacha registerUser', () => {
    // Renderizamos el formulario con la prop mockeada
    render(<RegisterForm showRegister={showRegisterMock} />)

    // Simulamos completar los campos del formulario
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'luis' },
    })
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: 'Luis Gutierrez' },
    })
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: '12345' },
    })

    // Simulamos enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /crear cuenta/i }))

    // Verificamos que se haya despachado la acción
    expect(mockDispatch).toHaveBeenCalled()

    // Verificamos que showRegister(false) haya sido llamado (vuelve a login)
    expect(showRegisterMock).toHaveBeenCalledWith(false)
  })
})
