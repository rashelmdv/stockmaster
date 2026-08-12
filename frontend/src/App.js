import React, { useState, useEffect } from 'react';
import './App.css';

// ✅ TU API DE RAILWAY YA ESTÁ AQUÍ PUESTA
const API_URL = 'https://stockmaster-production-2043.up.railway.app/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar los productos. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="App">
      <header className="header">
        <h1>StockMaster - Gestión de Inventarios</h1>
        <p className="subtitle">Sistema de gestión de productos</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="container">
        <div className="products-container">
          <h2>Lista de Productos ({products.length})</h2>
          <div className="products-grid">
            {products.length === 0 ? (
              <p className="no-products">No hay productos registrados</p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description || 'Sin descripción'}</p>
                  <div className="product-details">
                    <span className="price">${product.price}</span>
                    <span className="quantity">Stock: {product.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;