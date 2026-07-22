import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Railway y otros proveedores de hosting proveen una DATABASE_URL.
// Para desarrollo local, podemos usar la URL o variables de entorno individuales.
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  // En producción (Railway), se suele requerir SSL.
  ssl: connectionString && connectionString.includes('onion') || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Función auxiliar para realizar consultas
export const query = (text, params) => pool.query(text, params);

export default pool;
