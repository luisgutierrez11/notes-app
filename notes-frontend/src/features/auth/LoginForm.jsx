import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { loginUser } from '../auth/authSlice'
import styles from './AuthForm.module.css'
// Formulario de inicio de sesión que maneja el login del usuario con Redux.
// Importa useDispatch y useSelector para interactuar con el store.

// Componente principal del formulario de login.
const LoginForm = () => {
  // Permite enviar acciones a Redux.
  const dispatch = useDispatch()

  // Extraemos del estado global el status y el error del authSlice.
  const { status, error } = useSelector(state => state.auth)

  // Maneja el envío del formulario de login.
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Maneja el envío del formulario de login.
  const handleLogin = (e) => {
    e.preventDefault() // Evita que el form recargue la página.

    // Envía la acción loginUser con los datos.
    dispatch(loginUser({ username, password }))

    // Resetea los inputs después del intento de login.
    setUsername('')
    setPassword('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Inicio de sesión</h2>
        <form onSubmit={handleLogin}>
          {/* Input de usuario */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">Usuario</label>
            <input 
              id='username' 
              className={styles.input}
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>

          {/* Input de contraseña */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input 
              id='password' 
              className={styles.input}
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {/* Botón de inicio de sesión */}
          <button type="submit" className={styles.button}>Iniciar sesión</button>

          {/* Estado de carga */}
          {status === 'loading' && 
            <p className={`${styles.message} ${styles.loading}`}>
              Ingresando...
            </p>}

          {/* Error si las credenciales fueron incorrectas */}
          {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
        </form>
      </div>
    </div>    
  )
}

export default LoginForm

