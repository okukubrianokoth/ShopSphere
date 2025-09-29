import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "/home/brian-okuku/Documents/ShopSphere/frontend/src/styles/product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category: ""
  });
  const navigate = useNavigate();

  // Get current user
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    const parsedData = JSON.parse(userData);
    return parsedData.user || parsedData;
  };

  // Get user-specific cart key
  const getCartKey = () => {
    const user = getCurrentUser();
    if (!user || !user.id) return null;
    return `cart_${user.id}`;
  };

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5555/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched products:", data); // ✅ Debug log

        // ✅ Handle both array and object response
        const productArray = Array.isArray(data) 
          ? data 
          : data.products || [];

        setProducts(productArray.sort(() => Math.random() - 0.5));
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  // Add to cart
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

  // Admin: Add new product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("http://localhost:5555/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10)
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) return alert(data.error);
      alert(`${data.name || data.product?.name} added successfully!`);

      setProducts([data.product || data, ...products]);
      setNewProduct({ name:"", description:"", price:"", stock:"", image_url:"", category:"" });
    })
    .catch(err => console.error(err));
  };

  // Filter products
  const filtered = products.filter(
    p => p.name.toLowerCase().includes(search.toLowerCase()) ||
         p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const isAdmin = getCurrentUser()?.is_admin;

  return (
    <div className="products-page">
      {/* Search */}
      <input
        className="search"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Admin Add Product Form */}
      {isAdmin && (
        <div style={{
          border: "1px solid #ccc",
          padding: "20px",
          margin: "20px 0",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9"
        }}>
          <h2 style={{ marginBottom: "15px", color: "#333" }}>Add New Product</h2>
          <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" placeholder="Name" value={newProduct.name}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Description" value={newProduct.description}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="number" placeholder="Price" value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="number" placeholder="Stock" value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} required
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Image URL" value={newProduct.image_url}
              onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <input type="text" placeholder="Category" value={newProduct.category}
              onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
            <button type="submit" style={{
              padding: "10px", borderRadius: "5px", border: "none",
              backgroundColor: "#007bff", color: "#fff", cursor: "pointer", fontWeight: "bold"
            }}>Add Product</button>
          </form>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {filtered.length > 0 ? (
          filtered.map(product => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
}
