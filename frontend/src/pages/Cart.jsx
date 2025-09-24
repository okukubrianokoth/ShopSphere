import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Plus, Minus, Trash } from "lucide-react";
import "./styles/cart.css";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Increase quantity
  const addQuantity = (id) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Decrease quantity
  const reduceQuantity = (id) => {
    const newCart = cart
      .map(item =>
        item.id === id ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) } : item
      );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Remove item from cart
  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  // Proceed with order
  const proceedOrder = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push({
      id: Date.now(),
      items: cart,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("cart", "[]");
    setCart([]);
    alert("Your order is on the way!");
  };

  if (cart.length === 0)
    return (
      <>
        <Navbar loggedIn={false} />
        <div className="cart-page empty">
          <p>
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
        </div>
      </>
    );

  return (
    <>
      <Navbar loggedIn={false} />
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
    </>
  );
}
