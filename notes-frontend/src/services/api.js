import axios from 'axios'
import { store } from '../store'
import { logoutUser } from '../features/auth/authSlice'

// ✅ Cliente Axios preconfigurado
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// ✅ Interceptor global para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o no es válido
    if (error.response?.status === 401) {
      console.warn('Token expirado o sesión inválida, cerrando sesión...')
      
      // Limpia el localStorage
      // Despacha logout en Redux
      store.dispatch(logoutUser())
    }

    // Si el servidor no responde
    if (!error.response) {
      console.error('Servidor no disponible.')
    }

    return Promise.reject(error)
  }
)

export default api
