import { useContext } from 'react';
import AppContext from '../services/AppContext';
import { FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';

const AddItem = ({ product }) => {
  const { state, addToCart, removeFromCart } = useContext(AppContext);

  const quantity = state.cart.filter(item => item._id === product._id).length;

  if (quantity === 0) {
    return (
      <button 
        onClick={() => addToCart(product)}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 transform hover:scale-105">
        <FiShoppingCart size={14} />
        Add to Cart
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between bg-gray-100 rounded-xl p-1">
      <button 
        onClick={() => removeFromCart(product._id)}
        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition"
      >
        <FiMinus size={14} />
      </button>

      <span className="font-semibold text-gray-800 text-sm min-w-[28px] text-center">
        {quantity}
      </span>

      <button 
        onClick={() => addToCart(product)}
        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition"
      >
        <FiPlus size={14} />
      </button>
    </div>
  );
};

export default AddItem;