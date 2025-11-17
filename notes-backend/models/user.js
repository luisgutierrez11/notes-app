const mongoose = require('mongoose')

// Esquema del usuario en la base de datos
const userSchema = new mongoose.Schema({
  // Nombre de usuario (único, requerido, al menos 6 caracteres)
  username: {
    type: String,
    minLength: 6,
    required: true,
    unique: true
  },

  // Nombre real del usuario (opcional)
  name: String,

  // Hash de la contraseña (obligatorio)
  passwordHash: {
    type: String,
    required: true,
    minLength: 6
  },

  // Relación: un usuario puede tener varias notas
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

// Transformación JSON para ocultar campos sensibles
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Convertimos _id a id
    returnedObject.id = returnedObject._id.toString()

    // Ocultamos campos internos
    delete returnedObject._id
    delete returnedObject.__v

    // Por seguridad, JAMÁS se envía el passwordHash
    delete returnedObject.passwordHash
  }
})

// Creamos el modelo User
const User = mongoose.model('User', userSchema)

module.exports = User
