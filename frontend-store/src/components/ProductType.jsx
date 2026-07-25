import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../services/AppContext';
import ProductGrid from './Reusable/ProductGrid';

const ProductType = () => {
  const { type } = useParams();
  const { state } = useContext(AppContext);
  
  const categoryProducts = 
    type === 'kids' ? state.kidsProducts :
    type === 'mens' ? state.mensProducts :
    type === 'womens' ? state.womensProducts : [];

  return <ProductGrid products={categoryProducts} title={`${type ? type.charAt(0).toUpperCase() + type.slice(1) : ''} Products`} />;
};

export default ProductType;