import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_pantry_key_2026_despensa';

// Middleware para verificar el token JWT en rutas protegidas
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
};

// Ruta: Registrar un usuario nuevo
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Validar si el email ya existe
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar usuario en la base de datos
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    // Generar el token JWT
    const token = jwt.sign(
      { id: newUser.rows[0].id, name: newUser.rows[0].name, email: newUser.rows[0].email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Error en /register:', error.message);
    res.status(500).json({ error: 'Error del servidor al registrar usuario.' });
  }
});

// Ruta: Iniciar Sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Validar si el usuario existe
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'El correo o la contraseña son incorrectos.' });
    }

    const user = result.rows[0];

    // Validar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'El correo o la contraseña son incorrectos.' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error en /login:', error.message);
    res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

// Ruta: Obtener información del usuario autenticado (Protegida)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error en /me:', error.message);
    res.status(500).json({ error: 'Error del servidor al obtener información del usuario.' });
  }
});

export default router;
