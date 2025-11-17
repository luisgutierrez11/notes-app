// Tests del endpoint /api/users

const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const Note = require('../models/note')

const api = supertest(app)
const helper = require('./test_helper')

/**
 * Pruebas relacionadas a creación de usuarios
 */
describe('usuarios', () => {
  /**
   * Antes de cada test:
   * - Limpia notas y usuarios
   * - Crea un usuario inicial
   */
  beforeEach(async () => {
    await Note.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    await new User({
      name: helper.initialUser.name,
      username: helper.initialUser.username,
      passwordHash
    }).save()
  })

  /**
   * Crear usuario válido
   */
  test('crear usuario con username único y contraseña válida', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nuevoUser',
      name: 'Nuevo Nombre',
      password: '123456'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('nuevoUser'))
  })

  /**
   * Username duplicado → 400
   */
  test('crear usuario con username duplicado falla con 400', async () => {
    await api
      .post('/api/users')
      .send({
        username: helper.initialUser.username,
        name: 'Nombre Dup',
        password: '123456'
      })
      .expect(400)
  })

  /**
   * Contraseña demasiado corta → 400
   */
  test('crear usuario con contraseña muy corta falla con 400', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'cortoPass',
        name: 'Nombre',
        password: '12'
      })
      .expect(400)
  })
})

/**
 * Final: cerrar conexión
 */
after(async () => {
  await mongoose.connection.close()
})
