import { useEffect, useState } from 'react';
import { initDb } from '../utils/dbHelper';

const ProductsApi = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const db = await initDb();
        const stmt = db.prepare("SELECT * FROM products");
        const fetchedProducts = [];
        
        while (stmt.step()) {
          fetchedProducts.push(stmt.getAsObject());
        }
        
        stmt.free();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // If we're still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Return the products as JSON
  return (
    <pre>
      {JSON.stringify(products, null, 2)}
    </pre>
  );
};

export default ProductsApi;
