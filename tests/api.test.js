const request = require('supertest');
const app = require('../backend/src/app');

describe('StockMaster API Tests', () => {
    let productId;

    beforeAll(async () => {
        // Configurar para pruebas
        process.env.NODE_ENV = 'test';
    });

    test('GET /health - Debe retornar OK', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body.service).toBe('StockMaster API');
    });

    test('POST /api/products - Debe crear un producto', async () => {
        const product = {
            name: 'Producto Test',
            description: 'Descripción de prueba',
            price: 99.99,
            quantity: 10
        };
        const response = await request(app)
            .post('/api/products')
            .send(product);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(product.name);
        expect(response.body.price).toBe(product.price);
        expect(response.body.quantity).toBe(product.quantity);
        productId = response.body.id;
    });

    test('GET /api/products - Debe listar productos', async () => {
        const response = await request(app).get('/api/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('PUT /api/products/:id - Debe actualizar producto', async () => {
        const updated = {
            name: 'Producto Actualizado',
            description: 'Nueva descripción',
            price: 149.99,
            quantity: 20
        };
        const response = await request(app)
            .put(`/api/products/${productId}`)
            .send(updated);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updated.name);
        expect(response.body.price).toBe(updated.price);
    });

    test('DELETE /api/products/:id - Debe eliminar producto', async () => {
        const response = await request(app)
            .delete(`/api/products/${productId}`);
        expect(response.status).toBe(204);
    });

    test('GET /api/products/:id - Debe retornar 404 para producto inexistente', async () => {
        const response = await request(app)
            .get(`/api/products/99999`);
        expect(response.status).toBe(404);
    });
});