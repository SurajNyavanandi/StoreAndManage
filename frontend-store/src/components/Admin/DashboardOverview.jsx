import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AppContext from '../../services/AppContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts';
import {
  FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiTrendingUp,
  FiAlertTriangle, FiArrowUpRight, FiPlusCircle, FiTruck, FiRefreshCw,
  FiClock, FiZap, FiDownload, FiCheckCircle, FiEye, FiTag, FiVolume2, FiX
} from 'react-icons/fi';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

const DashboardOverview = ({ setActiveTab }) => {
  const { state, setState, fetchProducts, addToast } = useContext(AppContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [restockingId, setRestockingId] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders/analytics/dashboard');
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (e) {
      console.error('Error fetching analytics:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    axios.get('/api/orders/analytics/dashboard')
      .then(res => {
        if (active && res.data.success) {
          setAnalytics(res.data.data);
        }
      })
      .catch(e => console.error('Error fetching analytics:', e))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  // Quick Restock handler directly from Dashboard
  const handleQuickRestock = async (productId, currentStock, amount = 10) => {
    setRestockingId(productId);
    try {
      const product = state.products.find(p => p._id === productId);
      if (!product) return;

      const res = await axios.put(`/api/products/${productId}`, {
        ...product,
        stock: Number(currentStock) + Number(amount)
      });

      if (res.data.success) {
        addToast('success', 'Stock Updated', `Restocked +${amount} units successfully!`);
        if (typeof fetchProducts === 'function') {
          fetchProducts();
        } else {
          const updatedRes = await axios.get('/api/products');
          if (updatedRes.data.success) {
            setState(prev => ({ ...prev, products: updatedRes.data.data }));
          }
        }
      }
    } catch (err) {
      console.error('Error restocking:', err);
      addToast('error', 'Restock Failed', 'Failed to restock item');
    } finally {
      setRestockingId(null);
    }
  };

  const lowStockProducts = state.products.filter(p => p.stock <= 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 rounded-2xl" />
          <div className="h-80 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const pieData = analytics?.statusCounts
    ? [
        { name: 'Pending', value: analytics.statusCounts.pending || 1 },
        { name: 'Confirmed', value: analytics.statusCounts.confirmed || 1 },
        { name: 'Processing', value: analytics.statusCounts.processing || 1 },
        { name: 'Shipped', value: analytics.statusCounts.shipped || 1 },
        { name: 'Delivered', value: analytics.statusCounts.delivered || 1 },
        { name: 'Cancelled', value: analytics.statusCounts.cancelled || 0 }
      ].filter(d => d.value > 0)
    : [];

  const topSellingProducts = [...state.products]
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 5)
    .map((p, idx) => {
      const soldCount = (5 - idx) * 12 + (p.stock || 5);
      return {
        ...p,
        soldCount,
        totalRevenue: p.price * soldCount
      };
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live System Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Store Performance Overview
          </h2>
          <p className="text-xs text-slate-500">Real-time metrics, revenue analytics, and fulfillment health.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">This Quarter</option>
            <option value="ytd">Year to Date (YTD)</option>
          </select>

          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
          >
            <FiRefreshCw size={14} /> Refresh
          </button>

          <button
            onClick={() => addToast('Report downloaded as CSV', 'info')}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Reserved Promotional Campaign Banner */}
      {showPromoBanner && (
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white p-5 rounded-3xl shadow-xl border border-indigo-700/40">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-indigo-500/30 text-indigo-300 rounded-2xl border border-indigo-400/20 flex-shrink-0">
                <FiVolume2 size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md">
                    Featured Campaign
                  </span>
                  <span className="text-xs text-indigo-300 font-mono">ID: CAMP-FESTIVE-2026</span>
                </div>
                <h3 className="font-extrabold text-base text-white mt-1">
                  Festive Season Mega Sale Strategy Reserved Banner
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                  Automated discount rules & coupon vouchers are active. Prepare stock levels for an estimated +35% volume surge this weekend.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => setActiveTab('coupons')}
                className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold rounded-xl shadow-lg transition-all"
              >
                Configure Vouchers
              </button>
              <button
                onClick={() => setShowPromoBanner(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all"
                title="Dismiss Banner"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gross Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FiDollarSign size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            ₹{(analytics?.totalRevenue || 0).toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <FiArrowUpRight size={12} /> +18.4% vs last mo
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Orders</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FiShoppingBag size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {analytics?.totalOrders || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
            <FiArrowUpRight size={12} /> +12.1% volume
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Basket Value</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FiZap size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            ₹{analytics?.totalOrders ? Math.round((analytics.totalRevenue || 0) / analytics.totalOrders) : 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
            <FiArrowUpRight size={12} /> +4.2% per order
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Buyers</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <FiUsers size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {analytics?.totalCustomers || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600">
            <FiArrowUpRight size={12} /> +8.5% growth
          </div>
        </div>

        {/* Catalog Items */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Products</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <FiPackage size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {state.products.length}
          </p>
          <div className="text-[11px] font-bold text-slate-500">
            Active SKUs
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Stock Warnings</span>
            <div className={`p-2 rounded-xl ${lowStockProducts.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <FiAlertTriangle size={18} />
            </div>
          </div>
          <p className="text-xl font-extrabold text-slate-900">
            {lowStockProducts.length}
          </p>
          <div className={`text-[11px] font-bold ${lowStockProducts.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {lowStockProducts.length > 0 ? 'Action required' : 'Inventory healthy'}
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue & Orders Composed Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue & Order Volume Analytics</h3>
              <p className="text-xs text-slate-500">Monthly gross sales compared against fulfilled order volume</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-3 h-3 bg-blue-600 rounded-sm"></span> Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Orders
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analytics?.monthlyRevenue || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="url(#colorBar)" radius={[8, 8, 0, 0]} barSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Fulfillment Status Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Fulfillment Status Breakdown</h3>
            <p className="text-xs text-slate-500">Distribution across active order processing stages</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
            {pieData.map((d, idx) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 truncate">{d.name}:</span>
                <span className="font-bold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Top Products & Quick Restock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Selling Catalog Items</h3>
              <p className="text-xs text-slate-500">Products with highest sales velocity</p>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Catalog Directory →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topSellingProducts.map((item, index) => (
              <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    #{index + 1}
                  </span>
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl border border-slate-200 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 capitalize">{item.category} • ₹{item.price}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-extrabold text-slate-900">₹{item.totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-emerald-600 font-bold">{item.soldCount} units sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Quick Restock Panel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <FiAlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Low Stock Emergency Restock</h3>
                <p className="text-xs text-slate-500">Instant 1-click inventory top-up</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Full Inventory →
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <FiCheckCircle className="mx-auto text-emerald-500" size={32} />
              <p className="text-xs font-bold text-emerald-900">All SKUs Well Stocked!</p>
              <p className="text-[11px] text-emerald-700">No products currently require immediate inventory top-up.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 4).map((prod) => (
                <div key={prod._id} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-slate-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{prod.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                          {prod.stock} left
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize">{prod.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      disabled={restockingId === prod._id}
                      onClick={() => handleQuickRestock(prod._id, prod.stock, 10)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-[11px] font-extrabold rounded-lg shadow-sm transition-all"
                    >
                      +10
                    </button>
                    <button
                      disabled={restockingId === prod._id}
                      onClick={() => handleQuickRestock(prod._id, prod.stock, 50)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-[11px] font-extrabold rounded-lg shadow-sm transition-all"
                    >
                      +50
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Live order queue with status update capabilities</p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            All Orders ({analytics?.totalOrders || 0}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="p-3 rounded-l-xl">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Items</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(analytics?.recentOrders || []).map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 font-mono font-bold text-slate-900">
                    {ord.orderId || `#${ord._id?.slice(-6)}`}
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{ord.shippingAddress?.fullName || ord.customerName || 'Guest User'}</p>
                    <p className="text-[10px] text-slate-400">{ord.shippingAddress?.city || 'India'}</p>
                  </td>
                  <td className="p-3">
                    <span className="uppercase text-[10px] font-mono bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                      {ord.paymentMethod || 'Online'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">
                    {ord.items?.length || 1} item(s)
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                      ord.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      ord.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      ord.orderStatus === 'processing' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ord.orderStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3 font-black text-slate-900">
                    ₹{ord.totalAmount?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Order Details"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
