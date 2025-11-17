const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// Obtener todas las notas (incluye el username del autor)
notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1 })

  res.json(notes)
})

// Obtener una nota por ID
notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

// Crear una nueva nota (requiere usuario autenticado mediante userExtractor)
notesRouter.post('/', userExtractor, async (request, response) => {
  const { content, important = false } = request.body
  const user = request.user

  // Si no hay usuario → token incorrecto o faltante
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Creamos la nota
  const note = new Note({
    content,
    important,
    user: user._id
  })

  const savedNote = await note.save()

  // Hacemos populate para devolver también info del usuario
  const populatedNote = await savedNote.populate('user', { username: 1 })

  // Agregamos la nota al usuario
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(populatedNote)
})

// Eliminar una nota (solo si pertenece al usuario)
notesRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const note = await Note.findById(request.params.id)

  // Si la nota no existe
  if (!note) {
    return response.status(404).json({ error: 'note not found' })
  }

  // Verifica propiedad de la nota
  if (note.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'unauthorized action' })
  }

  // Eliminamos la nota
  await note.deleteOne()

  // Quitamos la nota del array del usuario
  user.notes = user.notes.filter(n => n.toString() !== note._id.toString())
  await user.save()

  response.status(204).end()
})

// Actualizar una nota (solo si pertenece al usuario)
notesRouter.put('/:id', userExtractor, async (req, res) => {
  const { content, important } = req.body

  const note = await Note.findById(req.params.id)
  if (!note) return res.status(404).json({ error: 'nota no encontrada' })

  // Verificamos propiedad
  if (note.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'no autorizado para modificar esta nota' })
  }

  // Actualizamos la nota
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )

  const populatedNote = await updatedNote.populate('user', { username: 1 })
  res.json(populatedNote)
})

module.exports = notesRouter
