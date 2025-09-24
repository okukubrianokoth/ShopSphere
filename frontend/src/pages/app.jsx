import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "/home/walid/ShopSphere/frontend/src/components/Navbar.jsx";

// Pages
import Home from "/home/walid/ShopSphere/frontend/src/pages/Home.jsx";
import Products from "/home/walid/ShopSphere/frontend/src/pages/Products.jsx";
import Cart from "/home/walid/ShopSphere/frontend/src/pages/Cart.jsx";
import Profile from "/home/walid/ShopSphere/frontend/src/pages/Cart.jsx";
import AuthPage from "/home/walid/ShopSphere/frontend/src/pages/signin.jsx";

function App() {
  return (
    <Router>
      <Navbar loggedIn={!!localStorage.getItem("user")} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
