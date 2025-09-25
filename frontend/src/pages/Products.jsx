import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Get current user
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    // Handle both structures: direct user object or nested user object
    return parsedData.user || parsedData;
  };

  // Get user-specific cart key
  const getCartKey = () => {
    const user = getCurrentUser();
    if (!user || !user.id) {
      console.log("User or user.id not found:", user); // Debug log
      return null;
    }
    return `cart_${user.id}`; // Create user-specific cart key
  };

  // Fetch products from backend on load
  useEffect(() => {
    fetch("http://localhost:5555/api/products") // Backend endpoint
      .then(res => res.json())
      .then(data => {
        // Shuffle products randomly
        const shuffled = data.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      })
      .catch(err => console.error(err));
  }, []);

  // Add product to user-specific cart in localStorage
  function addToCart(product) {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
      alert("Please login to add items to cart");
      navigate("/auth");
      return;
    }

    const cartKey = getCartKey();
    if (!cartKey) {
      alert("Unable to add to cart. Please login again.");
      return;
    }

    // Get user-specific cart
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // If product exists, increase quantity
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      alert(`${product.name} quantity increased in cart!`);
    } else {
      // If new product, add with quantity 1
      cart.push({ ...product, quantity: 1 });
      alert(`${product.name} added to cart!`);
    }
    
    // Save to user-specific cart
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }

  // Filter products by search input
  const filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      <input
        className="search"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="products-grid">
        {filtered.length > 0 ? (
          filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={addToCart}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}