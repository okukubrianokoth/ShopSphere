import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import "/home/walid/ShopSphere/frontend/src/styles/navbar.css";

export default function Navbar({ loggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">ShopSphere</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart"><ShoppingCart size={20} /></Link>
        {loggedIn ? (
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
