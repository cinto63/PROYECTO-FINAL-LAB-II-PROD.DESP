# Sistema Formal - Monorepositorio Full Stack

Este es el punto de inicio para el proyecto de **Sistema Formal**, configurado con un frontend interactivo en **React (Vite) + Tailwind CSS v4** y un backend en **Express.js** conectado a una base de datos **PostgreSQL**.

---

## 📁 Estructura del Proyecto

*   **`frontend/`**: Aplicación de interfaz de usuario (React, Vite, Tailwind CSS v4).
*   **`backend/`**: Servidor de API REST (Express.js, pg - cliente de PostgreSQL).
*   **`.gitignore`**: Exclusión de archivos y carpetas locales (como `node_modules` y `.env`).

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu máquina local:
- [Node.js](https://nodejs.org/) (Recomendado v18 o superior).
- [Git](https://git-scm.com/).
- Una instancia local de [PostgreSQL](https://www.postgresql.org/) (opcional para desarrollo local si utilizas la base de datos de Railway directamente).

---

## 🚀 Desarrollo Local

### 1. Configurar el Backend

1. Entra al directorio del backend:
   ```bash
   cd backend
   ```
2. Crea una copia del archivo `.env.example` y renombrala como `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edita `.env` con las credenciales de tu base de datos PostgreSQL local:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://tu_usuario:tu_contraseña@localhost:5432/tu_base_de_datos
   ```
4. Inicia el servidor en modo desarrollo (se recarga automáticamente al hacer cambios):
   ```bash
   npm run dev
   ```
   El servidor estará disponible en [http://localhost:5000](http://localhost:5000). Puedes verificar el estado en [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

### 2. Configurar el Frontend

1. Entra al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Inicia la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   El sitio estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 🌐 Flujo de Trabajo con Git y GitHub

1. **Crear repositorio en GitHub**:
   - Ve a tu cuenta de GitHub y crea un nuevo repositorio vacío (sin README ni .gitignore).
2. **Conectar tu repositorio local**:
   - Abre tu terminal en el directorio raíz de este proyecto y ejecuta:
     ```bash
     git add .
     git commit -m "feat: configuracion inicial de frontend y backend"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
     git push -u origin main
     ```
3. **Trabajar con Ramas (Buenas Prácticas)**:
   - Para añadir una nueva funcionalidad, crea una nueva rama:
     ```bash
     git checkout -b feat/nombre-funcionalidad
     ```
   - Realiza tus cambios y haz commit:
     ```bash
     git add .
     git commit -m "feat: descripcion de la funcionalidad"
     ```
   - Sube la rama y crea un Pull Request en GitHub:
     ```bash
     git push origin feat/nombre-funcionalidad
     ```

---

## ☁️ Despliegue en Producción

### 1. Base de Datos y Backend en Railway
[Railway](https://railway.app/) es ideal para alojar bases de datos PostgreSQL y servidores Node.js de forma rápida.

#### Configurar PostgreSQL:
1. Regístrate en Railway e inicia un nuevo proyecto.
2. Selecciona **Provision PostgreSQL**. Esto creará una base de datos PostgreSQL activa.
3. Ve a la pestaña **Variables** del servicio PostgreSQL y copia la `DATABASE_URL`.

#### Configurar el Backend (Express):
1. Añade un nuevo servicio en tu proyecto de Railway conectándolo a tu repositorio de GitHub.
2. Selecciona el subdirectorio de despliegue como `backend`.
3. Configura las siguientes **Variables de Entorno** en la pestaña de configuración del servicio del Backend:
   - `PORT`: `5000` (o el puerto que prefieras, Railway lo asignará automáticamente en producción).
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (Railway permite vincular variables entre servicios de forma nativa).
4. Guarda las variables. Railway compilará y desplegará tu backend, generándote un dominio público (ejemplo: `https://tu-backend.up.railway.app`).

---

### 2. Frontend en Vercel
[Vercel](https://vercel.com/) es la mejor plataforma para alojar aplicaciones React (Vite).

1. Regístrate en Vercel y conecta tu cuenta de GitHub.
2. Haz clic en **Add New** > **Project** y selecciona tu repositorio.
3. Configura los parámetros del proyecto:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Selecciona `frontend` (esto es importante para que compile solo la UI).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. En **Environment Variables** (variables de entorno), puedes agregar la URL de tu API del backend de Railway si el frontend necesita consumirla (ejemplo: `VITE_API_URL` -> `https://tu-backend.up.railway.app`).
5. Haz clic en **Deploy**. Vercel te dará un dominio público seguro (HTTPS).
