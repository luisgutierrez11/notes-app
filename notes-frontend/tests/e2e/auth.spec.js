// Importamos las funciones principales de Playwright
import { test, expect } from '@playwright/test'


// Importamos helpers para preparar el entorno de pruebas
// resetDatabase: deja todo en estado inicial
// createUser: crea un usuario de prueba
// loginUser: realiza el login desde la UI
// initialUser: datos del usuario inicial
import { resetDatabase, createUser, loginUser, initialUser } from './helpers.js'

// Grupo de pruebas relacionadas al login
test.describe('Login tests', () => {

  // Antes de cada test se reinicia la base, se crea un usuario y se abre la app
  test.beforeEach(async ({ page }) => {
    await resetDatabase()
    await createUser(initialUser)
    await page.goto('/')
  })

  // Caso: login correcto con credenciales válidas
  test('Login exitoso con credenciales correctas', async ({ page }) => {
    // Utiliza el helper para completar formulario y enviar
    await loginUser(page, initialUser.username, initialUser.password)

    // Verifica que aparece el indicador de login exitoso
    await expect(page.getByTestId('login-exitoso')).toBeVisible()
  })

  // Caso: mensaje de error cuando las credenciales son incorrectas
  test('Error con credenciales incorrectas', async ({ page }) => {
    await loginUser(page, initialUser.username, 'wrongpass')

    // Busca el mensaje de error que debería aparecer
    await expect(page.getByText('invalid username or password')).toBeVisible()
  })

  // Caso: el usuario puede cerrar sesión
  test('El usuario puede cerrar sesión', async ({ page }) => {
    await loginUser(page, initialUser.username, initialUser.password)
    await expect(page.getByTestId('login-exitoso')).toBeVisible()

    // Clic al botón de logout
    await page.getByRole('button', { name: /log out/i }).click()

    // Verifica que volvió al formulario de login
    await expect(page.getByRole('button', { name: /Iniciar sesión/i })).toBeVisible()
  })
})
