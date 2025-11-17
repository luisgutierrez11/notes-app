import api from './api'

// URL base del endpoint de login
const baseUrl = '/api/login'

// Función para iniciar sesión
// Recibe las credenciales (username y password) y realiza un POST al backend
// Devuelve los datos del usuario + token retornados por la API
const login = async credentials => {
  const response = await api.post(baseUrl, credentials) // Envia credenciales al servidor
  return response.data // Retorna la respuesta útil
}

export default { login }