const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const notesRouter = require('./controllers/notes')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const app = express()

// Middleware para convertir automáticamente JSON en objetos JS
app.use(express.json())

// Habilita CORS para permitir que el frontend acceda al backend
app.use(cors())

// Configura Mongoose para evitar warnings del modo estricto
mongoose.set('strictQuery', false)

// Intento de conexión a MongoDB Atlas utilizando la URI del archivo de configuración
logger.info('connecting to', config.MONGODB_URI) 
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Middleware personalizado para registrar las solicitudes entrantes
app.use(middleware.requestLogger)

// Rutas principales del proyecto (controlador de notas, usuarios y login)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/notes', notesRouter)

// Ruta alterna para cuando el servidor se inicia en modo 'test' 
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// Middleware para manejar errores lanzados por rutas o controladores
app.use(middleware.errorHandler)

// Middleware que responde si la ruta no existe
app.use(middleware.unknownEndpoint)

module.exports = app
