import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../services/AppContext';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';

const Wishlist = () => {
  const { state, toggleWishlist, addToCart } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2"
          >
            <FiArrowLeft size={14} /> Back to Store
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <FiHeart className="text-rose-500 fill-rose-500" /> Saved Wishlist
          </h1>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
          {state.wishlist.length} Items
        </span>
      </div>

      {state.wishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            <FiHeart />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our collections and tap the heart icon on any product to save your favorite styles for later.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {state.wishlist.map((item) => (
            <div key={item._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 rounded-full shadow-md hover:bg-rose-50 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-base">₹{item.price}</span>
                  <button
                    onClick={() => {
                      addToCart(item);
                      toggleWishlist(item);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                  >
                    <FiShoppingCart size={14} /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
