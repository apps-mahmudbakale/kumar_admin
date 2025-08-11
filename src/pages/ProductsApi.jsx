import { useEffect, useState } from 'react';
import { getDb } from '../utils/dbHelper';

const ProductsApi = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const db = getDb();
        if (!db) {
          console.error('Database not initialized');
          setLoading(false);
          return;
        }

        const stmt = db.prepare("SELECT * FROM products");
        const fetchedProducts = [];
        
        while (stmt.step()) {
          fetchedProducts.push(stmt.getAsObject());
        }
        
        stmt.free();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([{ error: 'Failed to load products' }]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div className="p-4">Loading products...</div>;
  }

  return (
    <div className="p-4">
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(products, null, 2)}
      </pre>
    </div>
  );
};

export default ProductsApi;
