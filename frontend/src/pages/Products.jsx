import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    return parsedData.user || parsedData;
  };

  const getCartKey = () => {
    const user = getCurrentUser();
    if (!user || !user.id) {
      console.log("User or user.id not found:", user); 
      return null;
    }
    return `cart_${user.id}`;
  };

  useEffect(() => {
    fetch("http://localhost:5555/api/products")
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setProducts(shuffled);
      })
      .catch(err => console.error(err));
  }, []);

  function addToCart(product) {
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
    const cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
      alert(`${product.name} quantity increased in cart!`);
    } else {
      cart.push({ ...product, quantity: 1 });
      alert(`${product.name} added to cart!`);
    }
    
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }
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