import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx"; 

// Components
import Navbar from "../components/Navbar.jsx";
import Login from "../components/Login.jsx";

// Pages
import Home from "./Home.jsx";
import Products from "./Products.jsx";
import Cart from "./Cart.jsx";
import Profile from "./Profile.jsx";
import AddProduct from "./AddProduct.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
