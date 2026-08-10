const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'StockMaster API is running'
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        name: 'StockMaster API',
        version: '1.0.0',
        status: 'online'
    });
});

// Ruta de productos (ejemplo)
app.get('/api/products', (req, res) => {
    res.json([
        { id: 1, name: 'Producto 1', price: 100, quantity: 10 },
        { id: 2, name: 'Producto 2', price: 200, quantity: 5 }
    ]);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
    console.log('Health check: http://localhost:' + PORT + '/health');
});

module.exports = app;
