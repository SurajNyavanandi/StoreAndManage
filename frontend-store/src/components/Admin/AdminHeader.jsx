import React, { useState, useRef, useEffect, useContext } from 'react';
import AppContext from '../../services/AppContext';
import {
  FiSearch, FiBell, FiPlus, FiExternalLink, FiChevronRight,
  FiX, FiPackage, FiCheck, FiShoppingBag, FiTag, FiFilter
} from 'react-icons/fi';

const AdminHeader = ({ activeTab, setActiveTab, setMobileSidebarOpen }) => {
  const { state, setViewMode } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = searchRef.current?.querySelector('input');
        if (input) input.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products live
  const searchResults = searchQuery.trim()
    ? state.products.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const tabLabels = {
    overview: 'Executive Overview',
    products: 'Product Catalog',
    orders: 'Orders & Shipping',
    customers: 'Customer Directory',
    inventory: 'Inventory & Restock',
    coupons: 'Promotions & Vouchers'
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Branch Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 lg:hidden text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          >
            <FiSearch size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-900">StoreCentral</span>
            <FiChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-500">Admin</span>
            <FiChevronRight size={12} className="text-slate-400" />
            <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
              {tabLabels[activeTab] || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Center: Real Global Live Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-lg mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search products, SKUs, categories, brands... (⌘K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-10 pr-16 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder-slate-400"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX size={14} />
              </button>
            ) : (
              <span className="hidden md:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/60 rounded border border-slate-300">
                ⌘K
              </span>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showDropdown && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase text-slate-400 flex justify-between">
                <span>Matching Catalog Items</span>
                <span>{searchResults.length} results</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((prod) => (
                    <button
                      key={prod._id}
                      onClick={() => {
                        setActiveTab('products');
                        setShowDropdown(false);
                      }}
                      className="w-full p-3 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-xl border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                              {prod.sku || 'NO-SKU'}
                            </span>
                            <span className="capitalize">{prod.category}</span>
                            <span>•</span>
                            <span>Stock: {prod.stock}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        ₹{prod.price}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center space-y-2">
                  <FiSearch className="mx-auto text-slate-300" size={24} />
                  <p className="text-xs font-bold text-slate-700">No results found for "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400">Try searching for a different product name, SKU, or category.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Actions, Notifications & Storefront Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add Product Shortcut */}
          <button
            onClick={() => setActiveTab('products')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <FiPlus size={14} /> Add Item
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-all"
              title="System Alerts"
            >
              <FiBell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-xs text-slate-900">Notifications & Alerts</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl space-y-0.5">
                    <p className="font-bold text-amber-900">Low Stock Alert</p>
                    <p className="text-amber-700 text-[11px]">3 items have stock level below 5 units.</p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-0.5">
                    <p className="font-bold text-emerald-900">New Order Received</p>
                    <p className="text-emerald-700 text-[11px]">Order #ORD-2026-8812 paid ₹3,499 via UPI.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exit to Storefront Button */}
          <button
            onClick={() => setViewMode('store')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <span className="hidden sm:inline">Exit to Store</span>
            <FiExternalLink size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
