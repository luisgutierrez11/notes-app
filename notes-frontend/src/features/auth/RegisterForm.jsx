import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, resetStatus } from '../users/userSlice'
import styles from './AuthForm.module.css'

// Formulario de registro de usuarios con Redux Toolkit
// showRegister: función del componente padre para cerrar el formulario luego del registro
const RegisterForm = ({showRegister}) => {
  const dispatch = useDispatch()

  // Obtenemos estado global del slice de usuarios
  const { status, error } = useSelector(state => state.users)

  // Estados locales para almacenar los datos del formulario
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  // Efecto para limpiar mensajes tras un registro exitoso
  useEffect(() => {
    if (status === 'succeeded') {
      const timer = setTimeout(() => {
        dispatch(resetStatus())
      }, 3000) // limpia después de 3 segundos
      return () => clearTimeout(timer)
    }
  }, [status, dispatch])

  // Maneja el envío del formulario
  const handleRegister = (e) => {
    e.preventDefault()

    // Dispatch del thunk que hace la petición al backend
    dispatch(registerUser({ username, name, password }))

    // Limpiamos los campos locales
    setUsername('')
    setName('')
    setPassword('')

    // Cerramos el formulario en el componente padre
    showRegister(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Registrarse</h2>
        <form onSubmit={handleRegister}>

          {/* Campo usuario */}
          <div className={styles.field}>
            <label htmlFor='username' className={styles.label}>Usuario</label>
            <input 
              id='username'
              className={styles.input}
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          {/* Campo nombre */}
          <div className={styles.field}>
            <label htmlFor='name' className={styles.label}>Nombre</label>
            <input 
              id='name' 
              className={styles.input}
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {/* Campo contraseña */}
          <div className={styles.field}>
            <label htmlFor='password' className={styles.label}>Contraseña</label>
            <input 
              id='password' 
              type="password" 
              className={styles.input}
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {/* Botón crear cuenta */}
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            Crear cuenta
          </button>

          {/* Mensajes de estado */}
          {status === 'loading' && (
            <p className={`${styles.message} ${styles.loading}`}>Creando...</p>
          )}
          {status === 'succeeded' && (
            <p className={`${styles.message} ${styles.succeeded}`}>
              ✅ Usuario creado correctamente. Ahora podés iniciar sesión.
            </p>
          )}
          {status === 'failed' && (
            <p className={`${styles.message} ${styles.error}`}>❌ {error}</p>
          )}
        </form>

      </div>
    </div>
  )
}

export default RegisterForm
