// Tests de la API de login usando node:test y supertest
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)
const helper = require('./test_helper')

/**
 * Conjunto de pruebas relacionadas al login
 */
describe('login', () => {

  /**
   * Antes de cada test:
   * - Limpia la colección de usuarios
   * - Crea un usuario inicial con contraseña hasheada
   */
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)

    const user = new User({
      username: helper.initialUser.username,
      name: helper.initialUser.name,
      passwordHash
    })

    await user.save()
  })

  /**
   * Test: login correcto devuelve token y datos del usuario
   */
  test('login con credenciales correctas devuelve token', async () => {
    const credentials = {
      username: helper.initialUser.username,
      password: helper.initialUser.password
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Debe devolver un token y el username correcto
    assert(response.body.token)
    assert.strictEqual(response.body.username, helper.initialUser.username)
  })

  /**
   * Test: contraseña incorrecta → 401 Unauthorized
   */
  test('login con password incorrecta falla con 401', async () => {
    const credentials = {
      username: helper.initialUser.username,
      password: 'malPass'
    }

    await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
  })

  /**
   * Test: usuario inexistente → 401 Unauthorized
   */
  test('login con username inexistente falla con 401', async () => {
    const credentials = {
      username: 'noExiste',
      password: '123456'
    }

    await api
      .post('/api/login')
      .send(credentials)
      .expect(401)
  })
})

/**
 * Después de todas las pruebas
 * se cierra la conexión a MongoDB
 */
after(async () => {
  await mongoose.connection.close()
})
