import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AppContext from '../../services/AppContext';
import {
  FiSearch, FiTruck, FiCheckCircle, FiClock, FiPackage, FiX,
  FiPrinter, FiFileText, FiRefreshCw, FiMapPin, FiUser, FiMail, FiPhone
} from 'react-icons/fi';

const OrderManagement = () => {
  const { addToast } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newNote, setNewNote] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders/admin/all');
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/orders/admin/all')
      .then(res => {
        if (isMounted && res.data.success) {
          setOrders(res.data.data);
        }
      })
      .catch(e => console.error('Error fetching orders:', e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
        notes: newNote || undefined
      });

      if (res.data.success) {
        addToast('success', 'Order Updated', `Order #${orderId} marked as ${newStatus}`);
        fetchOrders();
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, notes: newNote || selectedOrder.notes });
        }
      }
    } catch (e) {
      addToast('error', 'Update Failed', e.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold">Pending</span>;
      case 'confirmed':
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">Confirmed</span>;
      case 'processing':
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold">Processing</span>;
      case 'shipped':
        return <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">Shipped</span>;
      case 'delivered':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">Delivered</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Order & Fulfillment Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track customer purchases, update fulfillment steps, and print order invoices.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-xl transition-all"
        >
          <FiRefreshCw size={16} /> Refresh Orders
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`capitalize px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st} {st !== 'all' && `(${orders.filter(o => o.orderStatus === st).length})`}
            </button>
          ))}
        </div>

        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Order Reference</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items & Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Placed Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    Loading order records...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 italic">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id || order.orderId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 font-mono">
                      #{order.orderId || 'ORD-2026-0000'}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{order.userName || 'Customer'}</p>
                        <p className="text-xs text-slate-500">{order.userEmail || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-slate-900">
                          ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                        <p className="text-xs text-slate-500">{order.totalItems || order.items?.length || 1} items</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`capitalize px-2.5 py-1 text-xs font-semibold rounded-lg ${
                          order.paymentStatus === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.paymentStatus || 'completed'}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(order.orderStatus)}</td>
                    <td className="p-4 text-xs text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all"
                      >
                        Manage & Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-900 text-white">
              <div>
                <span className="text-xs font-mono text-blue-400">Order Details</span>
                <h3 className="text-xl font-bold">Order #{selectedOrder.orderId}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20"
                >
                  <FiPrinter size={14} /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Order Fulfillment Status Tracker */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500">Update Fulfillment State</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'processing')}
                    className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-700"
                  >
                    Set Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'shipped')}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-indigo-700"
                  >
                    Set Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'delivered')}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700"
                  >
                    Set Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'cancelled')}
                    className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-rose-700"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>

              {/* Customer & Shipping Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <FiUser size={14} /> Customer Information
                  </h4>
                  <p className="text-sm font-bold text-slate-900">{selectedOrder.userName}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <FiMail size={12} /> {selectedOrder.userEmail}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <FiPhone size={12} /> {selectedOrder.shippingAddress?.phone || '+91 9876543210'}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
                    <FiMapPin size={14} /> Shipping Address
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedOrder.shippingAddress?.address || 'Flat 402, Sunshine Heights'}<br />
                    {selectedOrder.shippingAddress?.city || 'Mumbai'}, {selectedOrder.shippingAddress?.state || 'Maharashtra'} - {selectedOrder.shippingAddress?.zipCode || '400001'}<br />
                    {selectedOrder.shippingAddress?.country || 'India'}
                  </p>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-500">Order Items ({selectedOrder.items?.length || 1})</h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-bold border-b">
                        <th className="p-3">Item Name</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedOrder.items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold text-slate-900">{item.name}</td>
                          <td className="p-3 text-center font-bold">{item.quantity || 1}</td>
                          <td className="p-3 text-right">₹{item.price}</td>
                          <td className="p-3 text-right font-bold">₹{(item.price * (item.quantity || 1))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-slate-50 p-4 border-t flex justify-between items-center font-bold text-sm">
                    <span>Total Amount Paid</span>
                    <span className="text-emerald-600 text-lg">₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Fulfillment / Shipping Notes</label>
                <div className="p-3 bg-slate-50 rounded-xl border text-xs text-slate-700 italic">
                  {selectedOrder.notes || 'No fulfillment notes attached yet.'}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add courier tracking number or note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, selectedOrder.orderStatus)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
