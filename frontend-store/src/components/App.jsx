import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import AppContext from "../services/AppContext";
import Header from "./Header";
import Home from "./Home";
import ProductType from "./ProductType";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderSuccess from "./OrderSuccess";
import Wishlist from "./Wishlist";
import TrackOrder from "./TrackOrder";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import ForgotPassword from "./Auth/ForgotPassword";
import ProtectedRoute from "./Auth/Protectedroute";
import AdminLayout from "./Admin/AdminLayout";
import ToastContainer from "./Reusable/ToastContainer";

function App() {
  const { state } = useContext(AppContext);

  if (state.viewMode === 'admin') {
    return (
      <>
        <ToastContainer />
        <AdminLayout />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <Header />

      <div className="min-h-[calc(100vh-120px)]">
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/type/:type" element={<ProductType />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Cart & Checkout Routes */}
          <Route path="/cart" element={<Cart />} />
          
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-success" 
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
