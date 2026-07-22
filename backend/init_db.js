import pool from './db.js';

export const initDB = async () => {
  try {
    console.log('🤖 Iniciando validación y creación de tablas en la base de datos...');

    // 1. Crear Tabla de Usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabla "users" lista.');

    // 2. Crear Tabla de Productos de Despensa
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabla "products" lista.');

    // 3. Sembrar productos si la tabla está vacía
    const productCheck = await pool.query('SELECT COUNT(*) FROM products');
    const count = parseInt(productCheck.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 La tabla de productos está vacía. Sembrando artículos de despensa iniciales...');
      
      const seedProducts = [
        {
          name: 'Aceite de Oliva Extra Virgen',
          category: 'Aceites y Aderezos',
          price: 12.99,
          stock: 45,
          description: 'Aceite de oliva de categoría superior obtenido directamente de aceitunas y solo mediante procedimientos mecánicos. Prensado en frío, 500ml.',
          image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'
        },
        {
          name: 'Miel de Abeja de Azahar Orgánica',
          category: 'Endulzantes',
          price: 8.50,
          stock: 30,
          description: 'Miel cruda de flores de azahar, recolectada de forma artesanal y sostenible en colinas locales. 100% natural, sin filtrar. 450g.',
          image_url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80'
        },
        {
          name: 'Café de Especialidad Orgánico',
          category: 'Bebidas e Infusiones',
          price: 14.25,
          stock: 25,
          description: 'Granos de café de origen único (arábico), tostado medio con perfiles de cata dulces, notas de cacao y acidez cítrica brillante. Bolsa de 250g.',
          image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80'
        },
        {
          name: 'Pasta Tagliatelle de Trigo Artesanal',
          category: 'Granos y Pastas',
          price: 4.80,
          stock: 60,
          description: 'Pasta trefilada en bronce y secada lentamente a baja temperatura para obtener la textura perfecta que retiene las salsas. Hecho en Italia. 500g.',
          image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80'
        },
        {
          name: 'Mermelada de Frutos del Bosque Casera',
          category: 'Dulces y Conservas',
          price: 5.40,
          stock: 35,
          description: 'Elaborada a base de frambuesas, moras y arándanos frescos enteros. Endulzada sutilmente con azúcar de caña orgánica. 320g.',
          image_url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=80'
        },
        {
          name: 'Tomates Secos Premium en Aceite',
          category: 'Dulces y Conservas',
          price: 7.20,
          stock: 20,
          description: 'Tomates maduros secados al sol y marinados en aceite de oliva con ajo, albahaca y finas hierbas. Frasco de vidrio de 280g.',
          image_url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&auto=format&fit=crop&q=80'
        }
      ];

      for (const p of seedProducts) {
        await pool.query(
          `INSERT INTO products (name, category, price, stock, description, image_url) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [p.name, p.category, p.price, p.stock, p.description, p.image_url]
        );
      }
      console.log('✓ Se sembraron los productos iniciales con éxito.');
    } else {
      console.log(`ℹ La base de datos ya contiene ${count} productos. No es necesario sembrar.`);
    }
  } catch (err) {
    console.error('✗ Error inicializando la base de datos:', err.message);
  }
};
