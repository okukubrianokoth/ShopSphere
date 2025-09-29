import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx"; 

// Components
import Navbar from "../components/Navbar.jsx";

// Pages (these are in the same folder as app.jsx)
import Home from "./Home.jsx";
import Products from "./Products.jsx";
import Cart from "./Cart.jsx";
import Profile from "./Profile.jsx";
import AuthPage from "./signin.jsx";

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
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
