const mongoose = require('mongoose')

// Esquema de una nota en la base de datos
const noteSchema = new mongoose.Schema({
  // Contenido de la nota (obligatorio, mínimo 5 caracteres)
  content: {
    type: String,
    minLength: 5,
    required: true
  },

  // Indica si la nota es importante o no
  important: Boolean,

  // Relación con un usuario (referencia a User)
  // Cada nota pertenece a un usuario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Modificamos el formato JSON cuando enviamos datos al frontend
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Convertimos _id a id para simplicidad
    returnedObject.id = returnedObject._id.toString()

    // No mostramos _id ni __v
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Creamos el modelo Note basado en el esquema
const Note = mongoose.model('Note', noteSchema)

module.exports = Note
