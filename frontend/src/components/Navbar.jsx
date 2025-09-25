import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "/home/walid/ShopSphere/frontend/src/styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); 
    navigate("/auth");
  };

  const isLoggedIn = !!user;

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopSphere</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart"><ShoppingCart size={20} /></Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile"><User size={20} /></Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/auth">Login/Signup</Link>
        )}
      </div>
    </nav>
  );
}