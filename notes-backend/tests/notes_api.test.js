// Tests relacionados al CRUD de notas y autenticación
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')

const api = supertest(app)
const helper = require('./test_helper')

/**
 * Pruebas cuando inicialmente existen notas guardadas
 */
describe('cuando inicialmente hay algunas notas guardadas', () => {
  /**
   * Antes de cada test:
   * - Limpia notas
   * - Inserta notas iniciales
   */
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
  })

  test('las notas se devuelven como JSON', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('se devuelven todas las notas iniciales', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('una nota específica está dentro de las devueltas', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)

    assert(contents.includes('Notita 2'))
  })


  /**
   * Tests sobre obtener una nota específica
   */
  describe('viendo una nota específica', () => {

    test('tiene éxito con un id válido', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // Ajuste ya que user es un ObjectId
      noteToView.user = noteToView.user.toString()

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('devuelve 404 si la nota no existe', async () => {
      const id = await helper.nonExistingId()

      await api
        .get(`/api/notes/${id}`)
        .expect(404)
    })

    test('devuelve 400 si el id no es válido', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })


  /**
   * Tests que requieren autenticación (usuario logueado)
   */
  describe('con sesión iniciada', () => {

    /**
     * Antes de cada test de sesión:
     * - Crea un usuario y su token válido
     */
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)

      const user = new User({
        _id: helper.initialUser._id,
        username: helper.initialUser.username,
        passwordHash
      })

      await user.save()

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET,
        { expiresIn: '1h' }
      )

      global.authToken = token
    })


    /**
     * Crear nuevas notas
     */
    describe('adicción de una nueva nota', () => {

      test('éxito con datos válidos', async () => {
        const newNote = {
          content: 'Notita nueva',
          important: true
        }

        await api
          .post('/api/notes')
          .set('Authorization', `Bearer ${global.authToken}`)
          .send(newNote)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

        const contents = notesAtEnd.map(n => n.content)
        assert(contents.includes('Notita nueva'))
      })

      test('falla con 400 si los datos no son válidos', async () => {
        const invalidNote = { important: true }

        await api
          .post('/api/notes')
          .set('Authorization', `Bearer ${global.authToken}`)
          .send(invalidNote)
          .expect(400)

        const notesAtEnd = await helper.notesInDb()
        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
      })
    })


    /**
     * Actualizar notas
     */
    describe('actualizando una nota', () => {
      test('éxito con usuario autorizado', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToUpdate = notesAtStart[0]

        const updatedData = {
          ...noteToUpdate,
          important: !noteToUpdate.important
        }

        const response = await api
          .put(`/api/notes/${noteToUpdate.id}`)
          .set('Authorization', `Bearer ${global.authToken}`)
          .send(updatedData)
          .expect(200)

        assert.strictEqual(response.body.important, updatedData.important)
      })
    })


    /**
     * Eliminar notas
     */
    describe('eliminando una nota', () => {

      test('éxito con id válido', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
          .delete(`/api/notes/${noteToDelete.id}`)
          .set('Authorization', `Bearer ${global.authToken}`)
          .expect(204)

        const notesAtEnd = await helper.notesInDb()

        assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)

        const contents = notesAtEnd.map(n => n.content)
        assert(!contents.includes(noteToDelete.content))
      })
    })


    /**
     * Errores de permisos (403 Forbidden)
     */
    describe('falla con 403 si el usuario no es el creador', () => {

      beforeEach(async () => {
        const anotherUser = new User({
          username: 'anotheruser',
          passwordHash: await bcrypt.hash('123456', 10)
        })

        await anotherUser.save()

        const invalidToken = jwt.sign(
          { username: anotherUser.username, id: anotherUser._id },
          process.env.SECRET,
          { expiresIn: '1h' }
        )

        global.anotherAuthToken = invalidToken
      })

      test('al eliminar una nota', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]

        await api
          .delete(`/api/notes/${noteToDelete.id}`)
          .set('Authorization', `Bearer ${global.anotherAuthToken}`)
          .expect(403)

        const notesAtEnd = await helper.notesInDb()
        assert.strictEqual(notesAtEnd.length, notesAtStart.length)
      })

      test('al actualizar una nota', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToUpdate = notesAtStart[0]

        const updatedData = {
          ...noteToUpdate,
          important: !noteToUpdate.important
        }

        await api
          .put(`/api/notes/${noteToUpdate.id}`)
          .set('Authorization', `Bearer ${global.anotherAuthToken}`)
          .send(updatedData)
          .expect(403)

        const notesAtEnd = await helper.notesInDb()
        const unchangedNote = notesAtEnd.find(n => n.id === noteToUpdate.id)

        assert.strictEqual(unchangedNote.important, noteToUpdate.important)
      })
    })
  })


  /**
   * Tests de fallas de autenticación
   */
  describe('fallas de autenticación', () => {

    test('POST /api/notes sin token devuelve 401', async () => {
      await api.post('/api/notes').send({
        content: 'Nota sin token',
        important: true
      }).expect(401)
    })

    test('PUT sin token devuelve 401', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToUpdate = notesAtStart[0]

      await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send({ important: true })
        .expect(401)
    })

    test('DELETE sin token devuelve 401', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(401)
    })
  })
})

/**
 * Cerrar conexión al terminar
 */
after(async () => {
  await mongoose.connection.close()
})
