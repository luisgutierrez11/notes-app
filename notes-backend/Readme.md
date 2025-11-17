# 📝 Notas App — Backend

Backend de la aplicación **Notas App**, desarrollado con **Node.js + Express** y usando **MongoDB Atlas** como base de datos.  
Expone una API REST para gestionar notas.

---

## 🚀 Características

- API REST con endpoints CRUD
- Base de datos en MongoDB Atlas
- Middlewares personalizados (logs, manejo de errores, etc.)
- Validación básica de datos
- Tests con Node:test y Supertest

---

## 🧠 Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB Atlas + Mongoose**
- **dotenv**
- **CORS**
- **Node:test**
- **Supertest**

---

## ⚙️ Instalación y ejecución

### 1. Instalar dependencias

    npm install

### 2. Crear archivo .env

MONGODB_URI=tu_conexion_a_mongodb_atlas
PORT=3001

### 3. Ejecutar en modo desarrollo

npm run dev

Servidor disponible en:
http://localhost:3001

---

## 🧰 Scripts útiles

npm run dev // Inicia el servidor en modo desarrollo
npm start // Inicia el backend en modo producción
npm test // Ejecuta los tests del backend
npm run start:test // Inicia el servidor en modo test (si corresponde)

---

## 📂 Estructura del backend

backend/
├── controllers/
├── models/
├── tests/
├── utils/
│ ├── middleware.js
│ ├── logger.js
│ └── config.js
├── app.js
├── index.js
└── ...

---

## 🔗 Endpoints principales

GET /api/notes
Obtiene todas las notas.

POST /api/notes
Crea una nueva nota.

PUT /api/notes/:id
Edita una nota existente.

DELETE /api/notes/:id
Elimina una nota.

--

## 🧪 Pruebas

Las pruebas están hechas con:
node:test → para tests unitarios e integración
supertest → para testear endpoints HTTP
Ejecutar pruebas:
npm test

---

## 👨‍💻 Autor

Luis Gutiérrez
📧 luis.gut.11jm@gmail.com
🔗 https://github.com/luisgutierrez11
