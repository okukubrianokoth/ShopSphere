import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "/home/brian-okuku/Documents/ShopSphere/frontend/src/context/AuthContext.jsx"; 

// Components
import Navbar from "/home/brian-okuku/Documents/ShopSphere/frontend/src/components/Navbar.jsx";
import AdminRoute from "/home/brian-okuku/Documents/ShopSphere/frontend/src/components/AdminRoute.jsx";

// Pages
import Home from "/home/brian-okuku/Documents/ShopSphere/frontend/src/pages/Home.jsx";
import Products from "/home/brian-okuku/Documents/ShopSphere/frontend/src/pages/Products.jsx";
import Cart from "/home/brian-okuku/Documents/ShopSphere/frontend/src/pages/Cart.jsx";
import Profile from "/home/brian-okuku/Documents/ShopSphere/frontend/src/pages/Profile.jsx";
import AuthPage from "/home/brian-okuku/Documents/ShopSphere/frontend/src/pages/signin.jsx";

function App() {
  return (
    <AuthProvider> 
      <Router>
        <Navbar /> 
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <Products /> {/* Admin uses same Products page for adding products */}
              </AdminRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
