const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

// Middleware para loguear cada request
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)

  // No mostramos el body del login por seguridad
  if (request.path !== '/api/login') {
    logger.info('Body:', request.body)
  }

  logger.info('---')
  next()
}

// Middleware para extraer el usuario desde el token
const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')

  // Verificamos que el header exista y comience con "Bearer "
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.replace('Bearer ', '')
      const decodedToken = jwt.verify(token, process.env.SECRET)

      // El token debe contener un id válido
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }

      // Buscamos al usuario en la BD y lo guardamos en la request
      const user = await User.findById(decodedToken.id)
      request.user = user

    } catch (error) {
      // Si falla, el token es inválido o expiró
      return response.status(401).json({ error: 'token invalid or expired' })
    }

  } else {
    return response.status(401).json({ error: 'token missing' })
  }

  next()
}

// Ruta desconocida
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Manejo centralizado de errores
const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  // Cualquier otro error → 500
  response.status(500).json({ error: 'internal server error' })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}
