// Importamos herramientas de testing: render para montar el componente,
// screen para buscar elementos en el DOM virtual y fireEvent para simular eventos del usuario.
import { render, screen, fireEvent } from '@testing-library/react'

// Importamos los mocks de Redux creados para las pruebas unitarias.
import { mockDispatch, mockSelector } from '../__mocks__/react-redux'

// Importamos el componente a testear.
import Filter from '../../src/features/filters/Filter'

// Hacemos que react-redux use los mocks en lugar de su implementación real.
// Esto evita usar el store real y nos permite testear aisladamente el componente.
vi.mock('react-redux', () => import('../__mocks__/react-redux'))

// Comienza la suite de tests del componente <Filter />
describe('<Filter />', () => {

  // Antes de cada test reseteamos los mocks para evitar contaminación entre pruebas.
  beforeEach(() => {
    mockDispatch.mockClear()

    // mockSelector devuelve un estado por defecto donde el filtro es 'ALL'.
    // Esto simula el estado inicial del Redux store.
    mockSelector.mockImplementation((selector) =>
      selector({ filter: 'ALL' })
    )
  })

  // Test #1: Verifica que el componente renderice los botones
  // y que despache una acción cuando se hace clic en uno de ellos.
  it('renderiza los botones y despacha al hacer clic', () => {
    // Renderizamos el componente.
    render(<Filter />)

    // Seleccionamos el botón "Importantes".
    const importantBtn = screen.getByRole('button', { name: /^Importantes$/i })

    // Simulamos que el usuario hace clic.
    fireEvent.click(importantBtn)

    // Verificamos que mockDispatch haya sido llamado
    // → es decir, que el componente intenta cambiar el filtro.
    expect(mockDispatch).toHaveBeenCalled()
  })

  // Test #2: Comprueba que el botón correspondiente al filtro activo
  // aparezca deshabilitado.
  it('deshabilita el botón del filtro activo', () => {

    // Configuramos el mock para simular que el filtro activo es "IMPORTANT".
    mockSelector.mockImplementation((selector) =>
      selector({ filter: 'IMPORTANT' })
    )

    // Renderizamos el componente nuevamente.
    render(<Filter />)

    // Obtenemos el botón "Importantes".
    const importantBtn = screen.getByRole('button', { name: /^Importantes$/i })

    // Como 'IMPORTANT' es el filtro activo, este botón debe estar deshabilitado.
    expect(importantBtn).toBeDisabled()
  })
})
