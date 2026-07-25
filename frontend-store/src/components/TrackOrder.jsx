import React, { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin } from 'react-icons/fi';

const TrackOrder = () => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`/api/orders/track/${encodeURIComponent(query.trim())}`);
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (currentStatus, step) => {
    const sequence = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(step);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Search Header Banner */}
      <div className="text-center space-y-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl">
        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-widest inline-block">
          Order Tracking Portal
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Track Your Package Live</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Enter your Order Reference ID (e.g., ORD-2026-8812) or your registered email address to check delivery updates.
        </p>

        <form onSubmit={handleTrack} className="max-w-md mx-auto pt-4 flex gap-2">
          <input
            type="text"
            required
            placeholder="e.g. ORD-2026-8812 or email@example.com"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <FiSearch size={18} /> {loading ? 'Searching...' : 'Track'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6 space-y-3">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl">
                <FiXCircle />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">No matching order found</h3>
              <p className="text-xs text-slate-500">Please double check your Order ID or Email address and try again.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.orderId || order._id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Order Reference</span>
                    <h2 className="text-xl font-bold text-slate-900">#{order.orderId}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Amount</span>
                    <p className="text-lg font-extrabold text-emerald-600">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="py-4">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-6">Delivery Fulfillment Progress</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                    {[
                      { key: 'confirmed', label: 'Order Confirmed', icon: FiCheckCircle },
                      { key: 'processing', label: 'Processing & Packing', icon: FiPackage },
                      { key: 'shipped', label: 'Dispatched via Express', icon: FiTruck },
                      { key: 'delivered', label: 'Delivered', icon: FiMapPin }
                    ].map((step) => {
                      const state = getStepStatus(order.orderStatus, step.key);
                      const Icon = step.icon;

                      let badgeClass = 'bg-slate-100 text-slate-400 border-slate-200';
                      if (state === 'completed') badgeClass = 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20';
                      if (state === 'cancelled') badgeClass = 'bg-rose-100 text-rose-600';

                      return (
                        <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${badgeClass} transition-all`}>
                            <Icon size={20} />
                          </div>
                          <span className="text-xs font-bold text-slate-900">{step.label}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{state}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500">Items in this Package</h4>
                  <div className="divide-y divide-slate-200/60 text-xs">
                    {(order.items || []).map((it, idx) => (
                      <div key={idx} className="py-2 flex justify-between items-center">
                        <span className="font-semibold text-slate-900">{it.name} (x{it.quantity || 1})</span>
                        <span className="font-bold text-slate-900">₹{it.price * (it.quantity || 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900">
                    <span className="font-bold">Shipping Update: </span>{order.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
