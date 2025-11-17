import axios from 'axios'

// URL base del backend iniciada en modo 'test' exclusivamente para pruebas.
const BACKEND_URL = 'http://localhost:3001'

// Usuario inicial que se usará en múltiples pruebas.
export const initialUser = {
  username: 'luisao',
  name: 'Luis Tester',
  password: '123456'
}

// Reinicia completamente la base de datos usando la ruta especial del backend para testing.
export const resetDatabase = async () => {
  try {
    await axios.post(`${BACKEND_URL}/api/testing/reset`)
  } catch (error) {
    console.error('❌ Error al resetear la base de datos:', error.message)
  }
}

// Crea un usuario mediante la API del backend.
export const createUser = async (user) => {
  try {
    await axios.post(`${BACKEND_URL}/api/users`, user)
  } catch (error) {
    console.error('❌ Error al crear el usuario:', error.response?.data || error.message)
  }
}

// Helper para iniciar sesión dentro de Playwright.
export const loginUser = async (page, username, password) => {
  // Completa los campos del formulario  
  await page.getByLabel('Usuario').fill(username)
  await page.getByLabel('Contraseña').fill(password)
  // Envía el formulario
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  // Pequeña espera para evitar condiciones de carrera
  await page.waitForTimeout(500)
}

// Helper para crear una nota en la UI utilizando Playwright.
export const createNote = async (page, content) => {
    await page.getByPlaceholder('Nueva nota').fill(content)
    await page.getByRole('button', { name: 'Agregar' }).click()

    await page.waitForTimeout(300)
}
