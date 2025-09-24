import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import "./styles/navbar.css";

export default function Navbar({ loggedIn, onLogout }) {
  return (
    <header className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">ShopSphere</Link>
      </div>
      <nav className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart"><ShoppingCart size={20} /></Link>
        {loggedIn ? (
          <>
            <Link to="/profile"><User size={20} /></Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
}
