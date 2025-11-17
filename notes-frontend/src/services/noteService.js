// Importa una instancia preconfigurada de Axios (con baseURL)
import api from './api'

// Endpoint base para las notas
const baseUrl = '/api/notes'

// Token para manejar la autenticación del usuario
let token = null

// Guarda el token en memoria para enviarlo en cada request autenticado
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// Devuelve la config de headers con el token para requests protegidos
const getConfig = () => ({
  headers: { Authorization: token }
})

// Obtiene todas las notas del servidor (GET /notes)
const getAll = async () => {
  const response = await api.get(baseUrl)
  return response.data
}

// Crea una nueva nota (POST /notes)
const create = async (newObject) => {
  const response = await api.post(baseUrl, newObject, getConfig())
  return response.data
}

// Actualiza una nota existente (PUT /notes/:id)
const update = async (id, newObject) => {
  const response = await api.put(`${baseUrl}/${id}`, newObject, getConfig())
  return response.data
}

// Elimina una nota (DELETE /notes/:id)
const remove = async (id) => {
  const response = await api.delete(`${baseUrl}/${id}`, getConfig())
  return response.data
}

// Exporta los métodos del servicio y la función para configurar el token
export default { getAll, create, update, remove, setToken }
