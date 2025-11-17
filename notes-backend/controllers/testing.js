const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

// Borra todos los documentos de las colecciones Note y User
testingRouter.post('/reset', async (request, response) => {
  await Promise.all([
    Note.deleteMany({}),
    User.deleteMany({}),
  ])

  // 204 → Operación exitosa sin contenido
  response.status(204).end()
})

module.exports = testingRouter