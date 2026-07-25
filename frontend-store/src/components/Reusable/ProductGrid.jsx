import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AddItem from '../AddItem';
import AppContext from '../../services/AppContext';
import ProductDetailModal from '../ProductDetailModal';
import { FiHeart, FiEye } from 'react-icons/fi';

const ProductGrid = ({ products, title }) => {
  const navigate = useNavigate();
  const { state, toggleWishlist } = useContext(AppContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="bg-white py-12">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm">Discover our high-grade modern fashion collection</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => {
            const isWishlisted = state.wishlist?.some(w => w._id === product._id);

            return (
              <div 
                key={product._id} 
                className="group relative transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden border border-slate-100 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div 
                  className="relative overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img 
                    alt={product.name} 
                    src={product.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Quick Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-3 py-1.5 bg-white/90 text-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <FiEye size={14} /> Quick View
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all ${
                      isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-500'
                    }`}
                    title="Toggle Wishlist"
                  >
                    <FiHeart size={16} className={isWishlisted ? 'fill-white' : ''} />
                  </button>

                  {/* Stock Badge */}
                  {product.stock > 0 ? (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 bg-rose-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider block mb-0.5">
                      {product.brand || product.category}
                    </span>
                    <h3 
                      onClick={() => setSelectedProduct(product)}
                      className="text-sm font-bold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition"
                    >
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <p className="text-base font-extrabold text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      ★ {product.rating || 4.5}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="pt-1">
                    <AddItem product={product} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No products found</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductGrid;