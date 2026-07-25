import { useContext, useState } from 'react';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiTag, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AppContext from '../services/AppContext';
import axios from 'axios';

const Cart = () => {
  const { state, addToCart, removeFromCart, removeAllFromCart, addToast } = useContext(AppContext);
  const { cart } = state;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Calculate cart statistics
  const uniqueProducts = Array.from(
    new Map(cart.map(item => [item._id, item])).values()
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = Math.max(0, subtotal + tax + shipping - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await axios.post('/api/coupons/validate', {
        code: couponCode.trim(),
        cartTotal: subtotal
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setDiscountAmount(res.data.discountAmount);
        addToast('success', 'Coupon Applied', `Saved ₹${res.data.discountAmount} with ${res.data.coupon.code}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      addToast('error', 'Coupon Error', msg);
    }
  };

  const getItemQuantity = (productId) => {
    return cart.filter(item => item._id === productId).length;
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleAddItem = (product) => {
    addToCart(product);
  };

  const handleRemoveAllItems = (productId) => {
    removeAllFromCart(productId);
  };

  const handleCheckout = () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout', { state: { cartTotal: total, subtotal, tax, shipping } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 pt-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-8 group"
          >
            <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <FiShoppingBag size={48} className="text-gray-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">Looks like you haven't added any items yet</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 pt-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
            >
              <FiArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <p className="text-gray-500 text-sm">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {uniqueProducts.map((product) => {
                const quantity = getItemQuantity(product._id);
                const itemTotal = product.price * quantity;

                return (
                  <div key={product._id} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 border-b last:border-b-0 hover:bg-gray-50 transition group">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-xl bg-gray-100"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 capitalize">{product.category}</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-600 mt-2">₹{product.price.toLocaleString()}</p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end gap-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1.5">
                        <button
                          onClick={() => handleRemoveItem(product._id)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                        <button
                          onClick={() => handleAddItem(product)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <p className="text-base sm:text-lg font-semibold">₹{itemTotal.toLocaleString()}</p>

                      <button
                        onClick={() => handleRemoveAllItems(product._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
                        title="Remove all"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary & Checkout */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-32">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="my-4 space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1">
                  <FiTag /> Have a Coupon Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <FiCheckCircle size={12} /> {appliedCoupon.description}
                  </p>
                )}
              </form>

              <div className="flex justify-between items-center mb-6 mt-6">
                <span className="text-base sm:text-lg font-bold">Total</span>
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">₹{total.toLocaleString()}</span>
              </div>

              {shipping > 0 && (
                <p className="text-xs sm:text-sm text-blue-600 mb-4 p-3 bg-blue-50 rounded-xl">
                  Add ₹{(500 - subtotal).toLocaleString()} more for free shipping
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 transform hover:scale-[1.02]"
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;