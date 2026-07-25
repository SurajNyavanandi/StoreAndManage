import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import AppContext from '../services/AppContext';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get totals from cart or location state
  const cartTotal = location.state?.cartTotal || 0;
  const subtotal = location.state?.subtotal || 0;
  const tax = location.state?.tax || 0;
  const shipping = location.state?.shipping || 0;

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  // Redirect if not logged in
  if (!token) {
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

  // Redirect if no cart items
  if (state.cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Create order on backend
      const orderResponse = await axios.post(
        '/api/orders/create',
        {
          amount: cartTotal * 100, // Razorpay expects amount in paise
          currency: 'INR',
          cartItems: state.cart.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: state.cart.filter(c => c._id === item._id).length
          })),
          totalItems: state.cart.length,
          userEmail: user.email,
          userName: user.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency, keyId } = orderResponse.data;

      // Step 2: Initialize Razorpay
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SeXkFKSXUivyDm',
        amount: amount,
        currency: currency,
        name: 'viRAttoM',
        description: `Order #${orderId}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await axios.post(
              '/api/orders/verify',
              {
                orderId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              // Navigate to success page
              navigate('/order-success', { state: { orderId } });
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            console.error(err);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // Step 4: Open Razorpay
      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Demo fallback
        navigate('/order-success', { state: { orderId } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-40">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div className="space-y-4 pb-6 border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-700">Items ({state.cart.length})</span>
              <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Tax (18%)</span>
              <span className="font-semibold">₹{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">
                Shipping
                {shipping === 0 && <span className="text-green-600 text-xs ml-2">(FREE)</span>}
              </span>
              <span className="font-semibold">₹{shipping.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 mb-8">
            <span className="text-xl font-bold">Total Amount</span>
            <span className="text-3xl font-bold text-blue-600">₹{cartTotal.toLocaleString()}</span>
          </div>

          {/* Delivery Address */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Delivering to:</h3>
            <p className="text-gray-700 font-medium">{user.name}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Razorpay Note */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              🔒 Secure payment powered by Razorpay. Your payment information is encrypted and secure.
            </p>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Processing Payment...
              </>
            ) : (
              <>
                Pay ₹{cartTotal.toLocaleString()} with Razorpay
              </>
            )}
          </button>

          {/* Cancel Button */}
          <button
            onClick={() => navigate('/cart')}
            className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition"
          >
            Back to Cart
          </button>
        </div>

        {/* Security Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Why shop with us?</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <span>Secure SSL encrypted payments</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <span>100% authentic products</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <span>Fast shipping on all orders</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
              <span>Easy returns within 7 days</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Load Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};

export default Checkout;