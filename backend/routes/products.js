import express from 'express';
import pool from '../db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Ruta: Obtener todos los productos de despensa (Filtros opcionales: buscador 'q', categoría 'category')
router.get('/', async (req, res) => {
  const { q, category } = req.query;

  try {
    let queryText = 'SELECT * FROM products';
    const queryParams = [];

    if (q || category) {
      queryText += ' WHERE';
      const conditions = [];

      if (q) {
        queryParams.push(`%${q}%`);
        conditions.push(`name ILIKE $${queryParams.length}`);
      }

      if (category && category !== 'Todos') {
        queryParams.push(category);
        conditions.push(`category = $${queryParams.length}`);
      }

      queryText += ' ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY id DESC';

    const result = await pool.query(queryText, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error del servidor al obtener los productos.' });
  }
});

// Ruta: Registrar un nuevo producto en la despensa (Protegida)
router.post('/', authenticateToken, async (req, res) => {
  const { name, category, price, stock, description, image_url } = req.body;

  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'El nombre, la categoría, el precio y el stock son campos obligatorios.' });
  }

  const parsedPrice = parseFloat(price);
  const parsedStock = parseInt(stock, 10);

  if (isNaN(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
  }

  if (isNaN(parsedStock) || parsedStock < 0) {
    return res.status(400).json({ error: 'El stock debe ser un número entero no negativo.' });
  }

  // Imagen genérica de despensa/supermercado si no se provee una
  const finalImageUrl = image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';

  try {
    const result = await pool.query(
      `INSERT INTO products (name, category, price, stock, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, category, parsedPrice, parsedStock, description || '', finalImageUrl]
    );

    res.status(201).json({
      message: 'Producto añadido exitosamente a la despensa.',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error al añadir producto:', error.message);
    res.status(500).json({ error: 'Error del servidor al registrar el producto.' });
  }
});

export default router;
