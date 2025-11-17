// Carga variables de entorno desde el archivo .env
// Esto permite mantener claves sensibles fuera del código
require('dotenv').config()

// Puerto en el cual se ejecutará el servidor (definido en .env)
const PORT = process.env.PORT

// Selecciona la URI de MongoDB según el ambiente.
// Si estamos en modo "test", usa la base de datos de testing.
// En cualquier otro caso, usa la base real (MONGODB_URI).
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

// Exporta los valores para que puedan ser utilizados en otros módulos
module.exports = {
  MONGODB_URI,
  PORT
}