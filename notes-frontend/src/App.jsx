import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import notesService from './services/noteService'
import { setUser, logoutUser } from './features/auth/authSlice'
import LoginForm from './features/auth/LoginForm'
import Filter from './features/filters/Filter'
import NoteList from './features/notes/NoteList'
import NoteForm from './features/notes/NoteForm'
import RegisterForm from './features/auth/RegisterForm'
import styles from './App.module.css'

// Componente principal de la aplicación
const App = () => {
  // Extraemos el usuario autenticado desde Redux
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  // Maneja si debe mostrarse el formulario de registro o el de login
  const [showRegister, setShowRegister] = useState(false)

  // Al cargar la app, revisa si ya hay un usuario guardado en localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

    // Si existe un usuario previo, lo cargamos en Redux y configuramos el token de notas
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      notesService.setToken(user.token)
    }
  }, [dispatch])

  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>App de Notas</h1>
      </header>

      <main className={styles.main}>
        {/* Si el usuario NO está logueado */}
        {!user ? (
          <>
            {/* Alternamos entre login y registro */}
            {showRegister ? (
              <>
                {/* Formulario de registro */}
                <RegisterForm showRegister={setShowRegister} />
                <p className={styles.switchText}>
                  ¿Ya tenés cuenta?{' '}
                  <button 
                    type='button'
                    onClick={() => setShowRegister(false)} 
                    className={styles.linkButton}
                  >
                    Iniciar sesión
                  </button>
                </p>
              </>
            ) : (
              <>
                {/* Formulario de login */}
                <LoginForm />
                <p className={styles.switchText}>
                  ¿No tenés cuenta?{' '}
                  <button 
                    type='button'
                    onClick={() => setShowRegister(true)}
                    className={styles.linkButton}
                  >
                    Registrarse
                  </button>
                </p>
              </>
            )}
          </>
        ) : (
        // Si el usuario ESTÁ logueado
        <>
          {/* Mensaje de bienvenida */}
          <p data-testid="login-exitoso" className={styles.welcome}>
            Bienvenido, {user.name}!
          </p>

          {/* Botón de logout */}
          <button 
            className={styles.logoutButton} 
            onClick={() => dispatch(logoutUser())}
          >
            log out
          </button>

          {/* Componentes principales */}
          <Filter />
          <NoteList />
          <NoteForm />      
        </>
        )}
      </main>

    </div>
  )
}

export default App