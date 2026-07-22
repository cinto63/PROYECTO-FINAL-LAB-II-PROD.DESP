import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de Middlewares
app.use(cors());
app.use(express.json());

// Endpoint base para testear el backend
app.get('/', (req, res) => {
  res.json({ message: 'Servidor Express listo y corriendo correctamente.' });
});

// Endpoint de salud (comprueba la conexión a la base de datos)
app.get('/api/health', async (req, res) => {
  try {
    // Consulta simple para validar conexión a base de datos
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      message: 'El servidor está activo y conectado a PostgreSQL.',
      dbTime: dbCheck.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'El servidor está activo, pero falló la conexión con PostgreSQL.',
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Servidor corriendo en puerto: ${PORT}`);
  console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});
