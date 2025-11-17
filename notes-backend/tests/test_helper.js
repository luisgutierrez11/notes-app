// Helpers para los tests: datos iniciales y funciones auxiliares

const mongoose = require('mongoose')
const Note = require('../models/note')
const User = require('../models/user')

/**
 * Usuario inicial utilizado para poblar BD y asociar notas
 */
const initialUser = {
  _id: new mongoose.Types.ObjectId('652a1f9b9a0b123456789abc'),
  username: 'testuser',
  name: 'nametest',
  password: 'sekret'
}

/**
 * Notas iniciales usadas en varios tests
 */
const initialNotes = [
  {
    content: 'Nota inicial 1',
    important: false,
    user: initialUser._id
  },
  {
    content: 'Notita 2',
    important: true,
    user: initialUser._id
  }
]

/**
 * Devuelve un ID válido pero sin documento asociado
 */
const nonExistingId = async () => {
  const note = new Note({
    content: 'willremovethissoon',
    important: false,
    user: initialUser._id
  })

  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

/**
 * Devuelve todas las notas en la BD en formato JSON plano
 */
const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

/**
 * Devuelve todos los usuarios en formato JSON
 */
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  initialUser
}
