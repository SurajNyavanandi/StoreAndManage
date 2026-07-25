import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHome, FiLogOut, FiHeart, FiShield } from 'react-icons/fi';
import { MdChildCare, MdMan, MdWoman } from 'react-icons/md';
import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../services/AppContext';

function Header() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const { state, setViewMode } = useContext(AppContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const searchRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = searchQuery.trim() ? state.products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) : [];

  const handleCategoryClick = (category) => {
    navigate(`/type/${category}`);
    setSearchQuery('');
    setShowSuggestions(false);
    setMenuOpen(false);
    setSidebarOpen(false);
  };

  const handleProductSelect = (product) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/type/${product.category}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setSidebarOpen(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
    setSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 w-full">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          {/* Main Header Row */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 md:py-3">
            <div className="flex items-center justify-between gap-2 md:gap-4">
              
              {/* Left Section - Sidebar Toggle (Mobile) + Logo */}
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden text-gray-700 hover:text-blue-600 transition p-1.5 md:p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Menu"
                >
                  <FiMenu size={isMobile ? 20 : 22} />
                </button>

                {/* Logo */}
                <h1 
                  className="text-lg sm:text-xl md:text-2xl font-bold flex-shrink-0 cursor-pointer hover:opacity-80 transition" 
                  onClick={() => navigate('/')}
                >
                  <span className="text-gray-900">vi</span>
                  <span className="text-blue-600">R</span>
                  <span className="text-blue-600">A</span>
                  <span className="text-gray-900">t.to</span>
                  <span className="text-blue-600">M</span>
                </h1>
              </div>

              {/* Desktop Navigation - Hidden on Mobile */}
              <nav className="hidden md:flex gap-4 lg:gap-6">
                <button 
                  onClick={() => handleCategoryClick('kids')} 
                  className="text-gray-700 hover:text-blue-600 text-sm lg:text-base font-medium transition flex items-center gap-1"
                >
                  <MdChildCare size={18} /> Kids
                </button>
                <button 
                  onClick={() => handleCategoryClick('mens')} 
                  className="text-gray-700 hover:text-blue-600 text-sm lg:text-base font-medium transition flex items-center gap-1"
                >
                  <MdMan size={18} /> Men
                </button>
                <button 
                  onClick={() => handleCategoryClick('womens')} 
                  className="text-gray-700 hover:text-blue-600 text-sm lg:text-base font-medium transition flex items-center gap-1"
                >
                  <MdWoman size={18} /> Women
                </button>
              </nav>

              {/* Search Bar - Responsive width */}
              <div ref={searchRef} className="relative flex-1 max-w-[140px] xs:max-w-[180px] sm:max-w-[240px] md:max-w-xs lg:max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={isMobile ? 14 : 16} />
                  <input
                    type="text"
                    placeholder={isMobile ? "Search..." : "Search products..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-7 md:pl-10 pr-2.5 md:pr-4 py-1.5 md:py-2 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                  />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 md:mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                    {suggestions.length > 0 ? (
                      suggestions.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleProductSelect(product)}
                          className="w-full px-3 py-2.5 text-left hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition flex items-center gap-3 group"
                        >
                          <img src={product.image} alt={product.name} className="w-9 h-9 object-cover rounded-lg border border-slate-200" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-slate-500 capitalize">
                              {product.category} • ₹{product.price}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                {/* Admin Portal Toggle */}
                <button
                  onClick={() => setViewMode('admin')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  title="Switch to Admin Dashboard"
                >
                  <FiShield size={14} className="text-blue-400" />
                  <span className="hidden sm:inline">Admin Portal</span>
                </button>

                <button 
                  onClick={() => navigate('/wishlist')}
                  className="relative text-gray-700 hover:text-rose-600 transition p-1.5 md:p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Wishlist"
                  title="Saved Wishlist"
                >
                  <FiHeart size={isMobile ? 18 : 20} />
                  {state.wishlist?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                      {state.wishlist.length}
                    </span>
                  )}
                </button>

                <button 
                  onClick={handleCartClick}
                  className="relative text-gray-700 hover:text-blue-600 transition p-1.5 md:p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Cart"
                >
                  <FiShoppingCart size={isMobile ? 18 : 20} />
                  {state.cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center animate-pulse text-[10px] md:text-xs">
                      {state.cart.length > 9 ? '9+' : state.cart.length}
                    </span>
                  )}
                </button>

                {!token ? (
                  <button 
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-1 md:gap-2 text-gray-700 hover:text-blue-600 transition p-1.5 md:p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Login"
                  >
                    <FiUser size={isMobile ? 18 : 20} />
                    <span className="hidden sm:inline text-xs md:text-sm">Login</span>
                  </button>
                ) : (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 md:gap-2 text-gray-700 hover:text-red-600 transition p-1.5 md:p-2 rounded-lg hover:bg-gray-100"
                    aria-label="Logout"
                  >
                    <FiLogOut size={isMobile ? 18 : 20} />
                    <span className="hidden sm:inline text-xs md:text-sm">Logout</span>
                  </button>
                )}

                {/* Mobile Menu Toggle - Only show on mobile */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden text-gray-700 hover:text-blue-600 p-1.5 rounded-lg hover:bg-gray-100"
                  aria-label="Menu"
                >
                  {menuOpen ? <FiX size={isMobile ? 18 : 20} /> : <FiMenu size={isMobile ? 18 : 20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Categories */}
        {menuOpen && (
          <nav className="md:hidden fixed top-[49px] sm:top-[53px] md:top-[57px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 max-h-[calc(100vh-60px)] overflow-y-auto">
            <div className="px-3 py-2 space-y-0.5">
              <button 
                onClick={() => { handleCategoryClick('kids'); setMenuOpen(false); }} 
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-sm font-medium transition"
              >
                <MdChildCare size={20} /> Kids Wear
              </button>
              <button 
                onClick={() => { handleCategoryClick('mens'); setMenuOpen(false); }} 
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-sm font-medium transition"
              >
                <MdMan size={20} /> Mens Wear
              </button>
              <button 
                onClick={() => { handleCategoryClick('womens'); setMenuOpen(false); }} 
                className="flex items-center gap-3 w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-sm font-medium transition"
              >
                <MdWoman size={20} /> Womens Wear
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Sidebar Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  <span className="text-gray-900">vi</span>
                  <span className="text-blue-600">R</span>
                  <span className="text-blue-600">A</span>
                  <span className="text-gray-900">t.to</span>
                  <span className="text-blue-600">M</span>
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* User Info if logged in */}
              {token && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600">Welcome back,</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}
                  </p>
                </div>
              )}

              {/* Menu Items */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => { navigate('/'); setSidebarOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm sm:text-base"
                >
                  <FiHome size={18} /> Home
                </button>
                
                <button
                  onClick={() => { handleCategoryClick('kids'); setSidebarOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm sm:text-base"
                >
                  <MdChildCare size={18} /> Kids Wear
                </button>
                
                <button
                  onClick={() => { handleCategoryClick('mens'); setSidebarOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm sm:text-base"
                >
                  <MdMan size={18} /> Mens Wear
                </button>
                
                <button
                  onClick={() => { handleCategoryClick('womens'); setSidebarOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm sm:text-base"
                >
                  <MdWoman size={18} /> Womens Wear
                </button>

                <div className="border-t border-gray-200 my-4"></div>

                <button
                  onClick={() => { navigate('/cart'); setSidebarOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium text-sm sm:text-base"
                >
                  <FiShoppingCart size={18} /> Shopping Cart 
                  {state.cart.length > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {state.cart.length}
                    </span>
                  )}
                </button>

                {!token ? (
                  <button
                    onClick={() => { navigate('/login'); setSidebarOpen(false); }}
                    className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm sm:text-base"
                  >
                    <FiUser size={18} /> Login / Register
                  </button>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium text-sm sm:text-base"
                  >
                    <FiLogOut size={18} /> Logout
                  </button>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[49px] sm:h-[53px] md:h-[57px]"></div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @media (max-width: 400px) {
          .xs\\:max-w-\\[180px\\] {
            max-width: 180px;
          }
        }
      `}</style>
    </>
  );
}

export default Header;