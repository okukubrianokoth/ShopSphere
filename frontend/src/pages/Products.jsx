import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

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

  // Add product to cart in localStorage
  function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
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
