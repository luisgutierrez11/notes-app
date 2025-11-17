const { test } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { errorHandler, unknownEndpoint } = require('../utils/middleware')

/* ============================================================
   1. PRUEBA DE BCRYPT: genera y valida hashes correctamente
   ============================================================ */
test('bcrypt genera un hash válido y lo valida correctamente', async () => {
    const password = 'supersecreto'

    // Generamos un hash con saltRounds = 10
    const hash = await bcrypt.hash(password, 10)

    // El hash debe comenzar con el prefijo estándar de bcrypt
    assert.ok(hash.startsWith('$2b$'), 'El hash no tiene el formato esperado')

    // Comparamos contraseña original vs hash
    const match = await bcrypt.compare(password, hash)
    assert.strictEqual(match, true)
})

/* ============================================================
   2. errorHandler devuelve 400 ante un ValidationError
   ============================================================ */
test('errorHandler responde 400 ante ValidationError', () => {
    let statusCode, jsonResponse

    const error = { name: 'ValidationError', message: 'Invalid user' }

    // Fake response para capturar lo que devuelva el middleware
    const response = {
        status: (code) => { statusCode = code; return response },
        json: (data) => { jsonResponse = data }
    }

    errorHandler(error, {}, response, () => {})

    assert.strictEqual(statusCode, 400)
    assert.deepStrictEqual(jsonResponse, { error: 'Invalid user' })
})

/* ============================================================
   3. errorHandler devuelve 401 ante JsonWebTokenError
   ============================================================ */
test('errorHandler responde 401 ante JsonWebTokenError', () => {
    let statusCode, jsonResponse

    const error = { name: 'JsonWebTokenError', message: 'token invalid' }

    const response = {
        status: (code) => { statusCode = code; return response },
        json: (data) => { jsonResponse = data }
    }

    errorHandler(error, {}, response, () => {})

    assert.strictEqual(statusCode, 401)
    assert.deepStrictEqual(jsonResponse, { error: 'token invalid' })
})

/* ============================================================
   4. JWT: genera un token y lo decodifica correctamente
   ============================================================ */
test('jwt genera y decodifica correctamente', () => {
    const user = { username: 'luis', id: 'abc123' }

    // Usamos SECRET real o uno por defecto para testing
    const secret = process.env.SECRET || 'secret_test'

    const token = jwt.sign(user, secret, { expiresIn: '1h' })

    // Verificamos que el token contiene los datos correctos
    const decoded = jwt.verify(token, secret)
    assert.strictEqual(decoded.username, 'luis')
    assert.strictEqual(decoded.id, 'abc123')
})

/* ============================================================
   5. unknownEndpoint responde 404 con el mensaje esperado
   ============================================================ */
test('unknownEndpoint responde 404 con mensaje correcto', () => {
    let statusCode, jsonResponse

    const response = {
        status: (code) => { statusCode = code; return response },
        send: (data) => { jsonResponse = data }
    }

    unknownEndpoint({}, response)

    assert.strictEqual(statusCode, 404)
    assert.deepStrictEqual(jsonResponse, { error: 'unknown endpoint' })
})
