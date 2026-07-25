import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AppContext = createContext();

function AppProvider(props) {
  const [state, setState] = useState({
    cart: [],
    wishlist: [],
    recentlyViewed: [],
    products: [],
    kidsProducts: [],
    mensProducts: [],
    womensProducts: [],
    loading: false,
    error: null,
    viewMode: localStorage.getItem('viewMode') || 'store', // 'store' or 'admin'
    appliedCoupon: null, // { code, discountType, value, discountAmount }
    toasts: []
  });

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await axios.get('/api/products', {
        params,
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setProducts(response.data.data);
        setState(prev => ({ ...prev, error: null }));
      } else {
        setState(prev => ({ ...prev, error: 'Failed to fetch products', loading: false }));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setState(prev => ({ ...prev, error: err.message || 'Error loading products', loading: false }));
    }
  }, []);

  // Load cart, wishlist, recentlyViewed from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      const savedRecent = localStorage.getItem('recentlyViewed');

      setState(prev => ({
        ...prev,
        cart: savedCart ? JSON.parse(savedCart) : [],
        wishlist: savedWishlist ? JSON.parse(savedWishlist) : [],
        recentlyViewed: savedRecent ? JSON.parse(savedRecent) : []
      }));
    } catch (e) {
      console.error('Error loading persistent state:', e);
    }
    fetchProducts();
  }, [fetchProducts]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  // Save recentlyViewed to localStorage
  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
  }, [state.recentlyViewed]);

  // Save viewMode to localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', state.viewMode);
  }, [state.viewMode]);

  const setProducts = (products) => {
    const kids = products.filter(p => p.category === 'kids');
    const mens = products.filter(p => p.category === 'mens');
    const womens = products.filter(p => p.category === 'womens');
    
    setState(prev => ({
      ...prev,
      products,
      kidsProducts: kids,
      mensProducts: mens,
      womensProducts: womens,
      loading: false
    }));
  };

  const addToCart = (product) => {
    setState(prev => ({
      ...prev,
      cart: [...prev.cart, product]
    }));
    addToast('success', 'Cart Updated', `Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId) => {
    setState(prev => {
      const index = prev.cart.findIndex(item => item._id === productId);
      if (index === -1) return prev;
      return {
        ...prev,
        cart: prev.cart.filter((_, i) => i !== index)
      };
    });
  };

  const removeAllFromCart = (productId) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item._id !== productId)
    }));
    addToast('info', 'Item Removed', 'Item removed from shopping cart');
  };

  const clearCart = () => {
    setState(prev => ({ ...prev, cart: [], appliedCoupon: null }));
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    const exists = state.wishlist.some(item => item._id === product._id);
    if (exists) {
      setState(prev => ({
        ...prev,
        wishlist: prev.wishlist.filter(item => item._id !== product._id)
      }));
      addToast('info', 'Wishlist', `Removed "${product.name}" from wishlist`);
    } else {
      setState(prev => ({
        ...prev,
        wishlist: [...prev.wishlist, product]
      }));
      addToast('success', 'Wishlist', `Saved "${product.name}" to wishlist`);
    }
  };

  // Recently Viewed Functions
  const addRecentlyViewed = (product) => {
    setState(prev => {
      const filtered = prev.recentlyViewed.filter(p => p._id !== product._id);
      return {
        ...prev,
        recentlyViewed: [product, ...filtered].slice(0, 10)
      };
    });
  };

  // View Mode Switcher
  const setViewMode = (mode) => {
    setState(prev => ({ ...prev, viewMode: mode }));
  };

  // Coupon Manager
  const setAppliedCoupon = (couponData) => {
    setState(prev => ({ ...prev, appliedCoupon: couponData }));
  };

  // Toast Notification Manager
  const addToast = (type = 'info', title = 'Notice', message = '') => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, title, message };
    setState(prev => ({ ...prev, toasts: [...prev.toasts, newToast] }));

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setState(prev => ({
      ...prev,
      toasts: prev.toasts.filter(t => t.id !== id)
    }));
  };

  const setLoading = (loading) => setState(prev => ({ ...prev, loading }));
  const setError = (error) => setState(prev => ({ ...prev, error }));

  return (
    <AppContext.Provider value={{ 
      state, 
      setState, 
      setProducts, 
      fetchProducts,
      addToCart, 
      removeFromCart,
      removeAllFromCart,
      clearCart,
      toggleWishlist,
      addRecentlyViewed,
      setViewMode,
      setAppliedCoupon,
      addToast,
      removeToast,
      setLoading, 
      setError 
    }}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppProvider };
export default AppContext;