// Importamos herramientas de testing: render para montar el componente,
// screen para consultar el DOM virtual y fireEvent para simular eventos del usuario.
import { render, screen, fireEvent } from '@testing-library/react'

// Importamos los mocks de Redux usados en las pruebas.
import { mockDispatch, mockSelector } from '../__mocks__/react-redux'

// Importamos el componente que vamos a probar.
import LoginForm from '../../src/features/auth/LoginForm'

// Indicamos que react-redux debe usar nuestros mocks.
vi.mock('react-redux', () => import('../__mocks__/react-redux'))

// Comienza la suite de pruebas para <LoginForm />
describe('<LoginForm />', () => {
  
  // Antes de cada test limpiamos dispatch y seteamos un estado inicial por defecto.
  beforeEach(() => {
    mockDispatch.mockClear()

    // Simulamos el estado inicial del slice auth: sin error y sin carga.
    mockSelector.mockImplementation((selector) =>
      selector({ auth: { status: 'idle', error: null } })
    )
  })

  // Test #1: Valida que el form despache loginUser con los datos ingresados.
  it('despacha loginUser con los datos correctos', () => {
    // Renderizamos el formulario.
    render(<LoginForm />)

    // Obtenemos los elementos del formulario.
    const usernameInput = screen.getByLabelText(/usuario/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    // Simulamos que el usuario escribe.
    fireEvent.change(usernameInput, { target: { value: 'luis' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    
    // Simulamos clic en el botón de enviar.
    fireEvent.click(submitButton)

    // Verificamos que se disparó un dispatch al enviar el form.
    expect(mockDispatch).toHaveBeenCalled()
  })

  // Test #2: Muestra un mensaje de carga si el estado es "loading".
  it('muestra mensaje de carga si status es loading', () => {
    // Simulamos que auth.status es "loading".
    mockSelector.mockImplementation((selector) =>
      selector({ auth: { status: 'loading', error: null } })
    )

    // Renderizamos.
    render(<LoginForm />)

    // Verificamos la presencia del mensaje.
    expect(screen.getByText(/ingresando/i)).toBeInTheDocument()
  })

  // Test #3: Muestra el error proveniente del store si existe.
  it('muestra mensaje de error si existe', () => {
    // Simulamos un estado donde hay un error en el login.
    mockSelector.mockImplementation((selector) =>
      selector({ auth: { status: 'failed', error: 'Usuario incorrecto' } })
    )

    render(<LoginForm />)

    // Verificamos que el mensaje de error aparezca en pantalla.
    expect(screen.getByText(/usuario incorrecto/i)).toBeInTheDocument()
  })
})
