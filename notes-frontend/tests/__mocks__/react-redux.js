// mockDispatch y mockSelector son funciones mockeadas utilizando Vitest (vi.fn()),
// que permiten simular el comportamiento de dispatch y useSelector durante pruebas unitarias.
// Estas funciones se reemplazan por las implementaciones reales de React-Redux en el entorno de test.
export const mockDispatch = vi.fn()
export const mockSelector = vi.fn()

// Mock de useDispatch: siempre devuelve la función mockDispatch.
export const useDispatch = () => mockDispatch

// Mock de useSelector: ejecuta el selector que recibe usando mockSelector.
export const useSelector = (selector) => mockSelector(selector)
