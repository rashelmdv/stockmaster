-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO products (name, description, price, quantity) VALUES
('Laptop Pro', 'Laptop de última generación con 16GB RAM y SSD 512GB', 1299.99, 10),
('Mouse Wireless', 'Mouse ergonómico inalámbrico con batería recargable', 29.99, 50),
('Teclado Mecánico', 'Teclado mecánico con retroiluminación RGB y switches azules', 89.99, 30),
('Monitor 4K', 'Monitor 4K de 27 pulgadas con HDR y 144Hz', 399.99, 15),
('Disco SSD 1TB', 'Disco SSD externo USB-C 1TB', 149.99, 25);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();