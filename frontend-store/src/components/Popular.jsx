import { useContext } from 'react';
import AppContext from '../services/AppContext';
import ProductGrid from './Reusable/ProductGrid';

const Popular = ({ title = 'Popular Products', category }) => {
  const { state } = useContext(AppContext);
  const { products, kidsProducts, mensProducts, womensProducts, loading, error } = state;

  const getPopularProducts = (productsArray) => {
    return productsArray.filter(p => p.rating >= 4).slice(0, 4);
  };

  const displayProducts = 
    category === 'kids' ? getPopularProducts(kidsProducts) : 
    category === 'mens' ? getPopularProducts(mensProducts) : 
    category === 'womens' ? getPopularProducts(womensProducts) : 
    getPopularProducts(products);

  if (loading) return <div className="bg-white py-12"><p className="text-center text-gray-600">Loading products...</p></div>;
  if (error) return <div className="bg-white py-12"><p className="text-center text-red-600">{error}</p></div>;

  return <ProductGrid products={displayProducts} title={title} />;
};

export default Popular;