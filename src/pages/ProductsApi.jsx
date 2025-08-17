import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ProductsApi = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = [];
        
        if (!productsSnapshot.empty) {
          productsSnapshot.forEach((doc) => {
            fetchedProducts.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setProducts(fetchedProducts);
        } else {
          console.warn('No products found in Firestore');
          setProducts([{ error: 'No products found' }]);
        }
      } catch (error) {
        console.error('Error loading products from Firestore:', error);
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
