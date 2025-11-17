const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Archivo encargado únicamente de iniciar el servidor.
// Se mantiene separado de app.js para facilitar el testing,
// ya que los tests pueden importar 'app' sin correr el servidor.
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})