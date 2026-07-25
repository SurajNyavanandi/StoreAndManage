import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';
import AppContext from '../services/AppContext';
import axios from 'axios';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setState } = useContext(AppContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Check authentication
    if (!token) {
      navigate('/login');
      return;
    }

    // Clear cart
    setState(prev => ({
      ...prev,
      cart: []
    }));

    // Fetch order details
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const response = await axios.get(
            `https://storeandmanage-backend.onrender.com/api/orders/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setOrder(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token, orderId, navigate, setState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  const displayItems = order?.items && order.items.length > 0 ? order.items : state.cart;
  const cartTotal = order?.totalAmount || location.state?.cartTotal || 0;
  const orderDateString = order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 pt-40">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="text-green-600" size={48} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 text-lg">Your payment was successful</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="text-2xl font-bold text-gray-900 font-mono">{order?.orderId || orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {orderDateString}
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {displayItems && displayItems.length > 0 ? (
                displayItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{item.name || item.product?.name} × {item.quantity || 1}</span>
                    <span className="font-semibold">₹{((item.price || item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Items loading...</p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total Paid</span>
              <span className="text-3xl font-bold text-blue-600">₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-sm text-blue-600 mt-2">📍 Delivery in 3-5 business days</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              ✓ Order confirmation email has been sent to <strong>{user.email}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => {
              // Generate invoice (for future implementation)
              alert('Invoice download feature coming soon!');
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Invoice
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">Need help?</p>
          <a href="mailto:support@virattom.com" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;