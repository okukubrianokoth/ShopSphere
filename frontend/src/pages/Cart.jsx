import React, { useEffect, useState } from "react";
import { Plus, Minus, Trash, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "/home/brian-okuku/Documents/ShopSphere/frontend/src/styles/cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);
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
    const user = getCurrentUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    const cartKey = getCartKey();
    if (cartKey) {
      const storedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");
      setCart(storedCart);
    }
  }, [navigate]);

  const saveCart = (newCart) => {
    const cartKey = getCartKey();
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(newCart));
    }
  };

  const addQuantity = (id) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(newCart);
    saveCart(newCart);
  };

  const reduceQuantity = (id) => {
    const newCart = cart
      .map(item =>
        item.id === id ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) } : item
      );
    setCart(newCart);
    saveCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    saveCart(newCart);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const proceedOrder = async () => {
    console.log("=== PROCEED ORDER DEBUG ===");
    
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    console.log("Cart items:", cart);

    const userData = localStorage.getItem("user");
    console.log("Raw user data from localStorage:", userData);
    
    if (!userData) {
      alert("You must be logged in to place an order.");
      return;
    }

    const parsedData = JSON.parse(userData);
    console.log("Parsed user data:", parsedData);
    
    const user = parsedData.user || parsedData;
    const token = parsedData.access_token;

    console.log("Extracted user:", user);
    console.log("Extracted token:", token ? `${token.substring(0, 20)}...` : "No token");

    if (!user || !token) {
      alert("Authentication data missing. Please login again.");
      return;
    }

    const orderPayload = {
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity || 1,
      })),
      status: "completed",
    };

    console.log("Order payload:", orderPayload);

    try {
      console.log("Making fetch request to:", "http://localhost:5555/api/orders");
      
      const res = await fetch("http://localhost:5555/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      console.log("Response status:", res.status);
      console.log("Response headers:", Object.fromEntries(res.headers.entries()));

      const responseText = await res.text();
      console.log("Response text:", responseText);

      if (!res.ok) {
        console.error("Request failed with status:", res.status);
        alert(`Order failed: ${res.status} - ${responseText}`);
        return;
      }
      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Order success result:", result);
      } catch (jsonError) {
        console.error("Response is not valid JSON:", jsonError);
        alert("Order may have been created, but got unexpected response format");
        return;
      }
      const cartKey = getCartKey();
      if (cartKey) {
        localStorage.setItem(cartKey, "[]");
      }
      setCart([]);
      alert("Your order is on the way! 🚚");
      
    } catch (networkError) {
      console.error("Network error:", networkError);
      alert(`Network error: ${networkError.message}`);
    }

    console.log("=== END PROCEED ORDER DEBUG ===");
  };

  if (cart.length === 0)
    return (
      <div className="cart-page empty">
        <ShoppingCart size={80} className="empty-cart-icon" />
        <p>
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>
      </div>
    );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} />
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p>KSh {(item.price * (item.quantity || 1)).toFixed(2)}</p>
              <div className="quantity-controls">
                <Minus size={20} onClick={() => reduceQuantity(item.id)} />
                <span>{item.quantity || 1}</span>
                <Plus size={20} onClick={() => addQuantity(item.id)} />
                <Trash size={20} onClick={() => removeItem(item.id)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Subtotal: KSh {subtotal.toFixed(2)}</p>
        <p>Tax (7%): KSh {tax.toFixed(2)}</p>
        <p><strong>Total: KSh {total.toFixed(2)}</strong></p>
        <button onClick={proceedOrder}>Proceed</button>
      </div>
    </div>
  );
}