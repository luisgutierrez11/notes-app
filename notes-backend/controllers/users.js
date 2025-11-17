const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// Obtener todos los usuarios
usersRouter.get('/', async (request, response) => {
    // populate trae todas las notas relacionadas con cada usuario
    const users = await User
        .find({}).populate('notes', { content: 1, important: 1 })

    response.json(users)
})

// Crear un nuevo usuario
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 6) {
    return response.status(400).json({ error: 'password must be at least 6 characters' })
  }

  // Encriptamos la contraseña
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Creamos el usuario
  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)  
})

// Eliminar un usuario por id (aunque no está siendo usado actualmente)
usersRouter.delete('/', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = usersRouter