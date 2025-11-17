// Función para imprimir mensajes informativos en consola.
// Durante los tests, NO se muestra nada para mantener limpio el output.
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(...params)
    }
}

// Función para imprimir mensajes de error en consola.
// También suprimida durante los tests.
const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params)
    }
}

// Exporta ambas funciones como un objeto
module.exports = {
    info, error
}