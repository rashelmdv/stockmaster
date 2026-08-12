const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// 🔥 CAMBIO AQUÍ: Permitir cualquier origen (CORS)
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. CONFIGURACIÓN DE LA BASE DE DATOS
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. CREAR LAS TABLAS Y DATOS AUTOMÁTICAMENTE AL ARRANCAR
const initDatabase = async () => {
  try {
    console.log('🔄 Conectando a la base de datos y creando tablas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO products (name, description, price, quantity)
      SELECT 'Laptop Pro', 'Laptop de última generación con 16GB RAM y SSD 512GB', 1299.99, 10
      WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Laptop Pro');
      INSERT INTO products (name, description, price, quantity)
      SELECT 'Mouse Wireless', 'Mouse ergonómico inalámbrico con batería recargable', 29.99, 50
      WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mouse Wireless');
      INSERT INTO products (name, description, price, quantity)
      SELECT 'Teclado Mecánico', 'Teclado mecánico con retroiluminación RGB y switches azules', 89.99, 30
      WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teclado Mecánico');
      INSERT INTO products (name, description, price, quantity)
      SELECT 'Monitor 4K', 'Monitor 4K de 27 pulgadas con HDR y 144Hz', 399.99, 15
      WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Monitor 4K');
      INSERT INTO products (name, description, price, quantity)
      SELECT 'Disco SSD 1TB', 'Disco SSD externo USB-C 1TB', 149.99, 25
      WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Disco SSD 1TB');
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
      CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
      CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);
    `);
    console.log('✅ Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('❌ ERROR FATAL:', error.message);
  }
};

initDatabase();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'StockMaster API is running'
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'StockMaster API',
        version: '1.0.0',
        status: 'online'
    });
});

app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos de la base de datos' });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, price, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.listen(PORT, () => {
    console.log('🚀 Servidor corriendo en puerto:', PORT);
});

module.exports = app;