import { useEffect, useState } from 'react';
import { Leaf, Sun, Wheat, TreePine } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const iconMap = {
  "Oil Seeds": Leaf,
  "Tree Nuts": TreePine,
  "Field Crops": Wheat,
  "Specialty Oils": Sun
};

const defaultProductCategories = [
  {
    icon: Leaf,
    title: "Oil Seeds",
    description: "Complete processing solutions for various oil-bearing seeds",
    color: "emerald",
    products: ["Soybean", "Sunflower Seed", "Rapeseed", "Sesame Seeds", "Safflower"]
  },
  {
    icon: TreePine,
    title: "Tree Nuts",
    description: "Specialized equipment for tree nut oil extraction",
    color: "amber",
    products: ["Shea Nuts", "Palm Kernel", "Copra (Coconut)", "Castor", "Neem"]
  },
  {
    icon: Wheat,
    title: "Field Crops",
    description: "Processing solutions for agricultural field crops",
    color: "orange",
    products: ["Cottonseed", "Groundnuts", "Jatropha", "Flax Seeds", "Mustard Seeds"]
  },
  {
    icon: Sun,
    title: "Specialty Oils",
    description: "Custom solutions for specialty and industrial oil production",
    color: "blue",
    products: ["Rice Bran", "Corn Germ", "Wheat Germ", "Grape Seeds", "Avocado"]
  }
];

const ProductsPage = () => {
  const [productCategories, setProductCategories] = useState(defaultProductCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from Firestore
        const productsSnapshot = await getDocs(collection(db, 'products'));
        
        if (!productsSnapshot.empty) {
          const fetchedProducts = [];
          productsSnapshot.forEach((doc) => {
            const productData = doc.data();
            fetchedProducts.push({
              id: doc.id,
              ...productData,
              icon: iconMap[productData.category] || Leaf,
              color: {
                "Oil Seeds": "emerald",
                "Tree Nuts": "amber",
                "Field Crops": "orange",
                "Specialty Oils": "blue"
              }[productData.category] || "emerald"
            });
          });
          
          setProductCategories(fetchedProducts);
        } else {
          console.warn('No products found in Firestore');
          // Fallback to default categories if no products in Firestore
          setProductCategories(defaultProductCategories);
        }
      } catch (error) {
        console.error('Error fetching products from Firestore:', error);
        // Fallback to default categories if Firestore fails
        setProductCategories(defaultProductCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600",
      amber: "bg-amber-100 text-amber-600 group-hover:bg-amber-600",
      orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600",
      blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600"
    };
    return colorMap[color] || colorMap.emerald;
  };

  const getBorderColor = (color) => {
    const borderMap = {
      emerald: "border-emerald-200 group-hover:border-emerald-300",
      amber: "border-amber-200 group-hover:border-amber-300",
      orange: "border-orange-200 group-hover:border-orange-300",
      blue: "border-blue-200 group-hover:border-blue-300"
    };
    return borderMap[color] || borderMap.emerald;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Oilseed Processing Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive processing solutions for a wide range of oilseeds and nuts, 
            delivering optimal extraction efficiency and product quality.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {productCategories.map((category, index) => (
            <div key={index} className={`group bg-white border-2 ${getBorderColor(category.color)} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
              <div className="flex items-start space-x-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-300 ${getColorClasses(category.color)} group-hover:text-white`}>
                  {category.image
                    ? <img src={category.image} alt={category.title} className="h-8 w-8 object-cover rounded" />
                    : <category.icon className="h-8 w-8" />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.products.map((product, productIndex) => (
                      <span 
                        key={productIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-default"
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Custom Solutions Available</h3>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                Don&apos;t see your specific oilseed or nut? We specialize in developing custom processing 
                solutions tailored to unique requirements and regional crops.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Pilot Testing</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Process Development</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="font-semibold">Scale-up Support</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-emerald-100">Different Oilseed Types Processed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
