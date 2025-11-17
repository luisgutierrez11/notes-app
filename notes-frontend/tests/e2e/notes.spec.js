// Importamos las funciones principales de Playwright
import { test, expect } from '@playwright/test'
// Helpers para operaciones repetidas: resetear, crear usuario, loguear, crear notas, etc.
import { resetDatabase, createUser, loginUser, createNote, initialUser } from './helpers.js'

// Grupo de pruebas para la app de notas
test.describe('Notes app', () => {
  // Antes de cada prueba dejamos todo limpio, creamos el usuario y abrimos la app
  test.beforeEach(async ({ page }) => {
    await resetDatabase()
    await createUser(initialUser)
    await page.goto('/')
  })

  test('El usuario puede loguearse y crear una nota', async ({ page }) => {
    await loginUser(page, initialUser.username, initialUser.password)

    // Verifica que el login fue exitoso
    await expect(page.getByTestId('login-exitoso')).toBeVisible()

    // Crear una nota
    const content = 'Mi primera nota desde Playwright!'
    await createNote(page, content)

    // Verifica que aparezca en pantalla
    await expect(page.getByText(content)).toBeVisible()
  })

  test('No se puede crear una nota vacía', async ({ page }) => {
    await loginUser(page, initialUser.username, initialUser.password)
    await expect(page.getByTestId('login-exitoso')).toBeVisible()

    // Intenta crear una nota vacía
    await page.getByRole('button', { name: /agregar/i }).click()

    // Contamos cuántas notas había antes
    const notasAntes = await page.locator('.note').count()

    // Click nuevamente sin escribir nada
    await page.getByRole('button', { name: /agregar/i }).click()

    // Verificamos que la cantidad no cambió
    await expect(page.locator('.note')).toHaveCount(notasAntes)
  })

  test('Las notas se muestran tras recargar la página', async ({ page }) => {
      await loginUser(page, initialUser.username, initialUser.password)
      await expect(page.getByTestId('login-exitoso')).toBeVisible()

      // Creo una nota y verifico que aparezca
      const content = 'Nota persistente desde Playwright'
      await createNote(page, content)
      await expect(page.getByText(content)).toBeVisible()

      // Recargar la página
      await page.reload()

      // La nota debe seguir visible
      await expect(page.getByText(content)).toBeVisible()
    })

    test('El usuario puede marcar una nota como importante', async ({ page }) => {
      await loginUser(page, initialUser.username, initialUser.password)
      await expect(page.getByTestId('login-exitoso')).toBeVisible()

      // Crear una nota
      const content = 'Nota importante'
      await createNote(page, content)

      // Esperar a que la nota aparezca
      const noteLocator = page.getByText(content)
      await expect(noteLocator).toBeVisible()

      // Esperar explícitamente al botón por si el render tarda
      const button = page.getByRole('button', { name: /marcar importante/i })
      await expect(button).toBeVisible()

      // Click y verificar el cambio de texto
      await button.click()
      await expect(page.getByRole('button', { name: /quitar importancia/i })).toBeVisible()
    })

    test('El usuario puede filtrar solo notas importantes', async ({ page }) => {
      await loginUser(page, initialUser.username, initialUser.password)

      // Crear y esperar a que aparezcan ambas notas
      await createNote(page, 'Nota normal')
      await createNote(page, 'Nota para marcar')
      await expect(page.getByText('Nota normal')).toBeVisible()
      await expect(page.getByText('Nota para marcar')).toBeVisible()

      // Seleccionar el botón "Marcar importante" dentro de la nota correcta
      const noteToMark = page.locator('text=Nota para marcar')
        .locator('..')
        .getByRole('button', { name: /marcar importante/i });
      await expect(noteToMark).toBeVisible()
      await noteToMark.click()

      // Usar el data-testid del filtro "Importantes" (para evitar confusión con "No importantes")
      await page.getByTestId('importante').click()

      // Verificar que solo se vea la nota importante
      await expect(page.getByText('Nota para marcar')).toBeVisible()
      await expect(page.getByText('Nota normal')).not.toBeVisible()
    })

})
