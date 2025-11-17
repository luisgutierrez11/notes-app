const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Ruta para iniciar sesión
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  // Buscamos al usuario por nombre de usuario
  const user = await User.findOne({ username })

  // Verificamos si existe y si la contraseña es correcta
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // Si usuario o contraseña no son válidos → error 401
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // Datos que incluiremos dentro del token JWT
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // Firmamos el token con un SECRET y un tiempo de expiración
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60 * 60 } // 1 hora
  )

  // Devolvemos token + datos mínimos del usuario
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
