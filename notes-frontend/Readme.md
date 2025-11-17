# 📝 Notas App — Frontend

Frontend de la aplicación **Notas App**, desarrollado con **React + Redux** y empaquetado con **Vite**.  
Permite crear, editar, eliminar y buscar notas, comunicándose con un backend mediante una API REST.

---

## 🚀 Características

- Crear notas con título y contenido
- Editar y eliminar notas
- Filtro / búsqueda de notas
- Estado global con Redux
- Comunicación con backend usando Axios
- Estilos con CSS Modules
- Interfaz limpia y responsive

---

## 🧠 Tecnologías utilizadas

- **React**
- **Redux Toolkit**
- **Vite**
- **Axios**
- **CSS Modules**

---

## ⚙️ Instalación y ejecución

### 1. Instalar dependencias

bash
npm install

### 2. Ejecutar en modo desarrollo

npm run dev

El proyecto se abrirá en:
http://localhost:5173
(o el puerto asignado por Vite)

---

## 🔗 Conexión con el backend

Asegúrate de que la URL base del backend esté configurada correctamente en:
src/services/notes.js

Por ejemplo:
const baseUrl = 'http://localhost:3001/api/notes'

---

## 🧰 Scripts disponibles

Comando Descripción
npm run dev Ejecuta el proyecto en modo desarrollo
npm run build Genera el build optimizado
npm run preview Previsualiza el build
npm test Ejecuta los tests con Vitest

---

## 📂 Estructura relevante

frontend/
├── src/
│ ├── components/
│ ├── features/
│ ├── services/
│ ├── store.js
│ ├── App.jsx
│ └── main.jsx
├── tests/
│ ├── unit/
│ ├── e2e/
│ └── mocks/

---

## 🧩 Próximas mejoras

Modo oscuro

Agrupar notas por categorías

Edición mejorada tipo editor enriquecido

---

## 👨‍💻 Autor

Luis Gutiérrez
📧 luis.gut.11jm@gmail.com
🔗 https://github.com/luisgutierrez11
