import api from "./api"

// URL base del endpoint de usuarios
const baseUrl = '/api/users'

// Función para registrar un usuario nuevo
// Recibe un objeto con username, name y password
// Envía los datos al backend mediante POST y retorna el usuario creado
const register = async (newUser) => {
  const response = await api.post(baseUrl, newUser) // Envía el nuevo usuario
  return response.data // Retorna los datos del usuario creado
}

export default { register }
