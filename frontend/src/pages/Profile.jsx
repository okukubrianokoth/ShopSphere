import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./styles/profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    username: "DemoUser",
    email: "demo@shopsphere.example"
  });
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  // Simulate fetching last 3 orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5555/api/orders?limit=3");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle account update
  const updateAccount = async () => {
    try {
      const response = await fetch("http://localhost:5555/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser)
      });
      if (response.ok) {
        setUser(updatedUser);
        setEditing(false);
        alert("Account updated successfully!");
      } else {
        alert("Failed to update account.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating account.");
    }
  };

  return (
    <>
      <Navbar loggedIn={true} />
      <div className="profile-page">
        <h2>Hi, {user.username}</h2>

        <div className="profile-actions">
          <button onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Update Account"}
          </button>
          {editing && (
            <div className="update-form">
              <input
                type="text"
                value={updatedUser.username}
                onChange={e => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                placeholder="Username"
              />
              <input
                type="email"
                value={updatedUser.email}
                onChange={e => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                placeholder="Email"
              />
              <button onClick={updateAccount}>Save</button>
            </div>
          )}

          <button onClick={fetchOrders}>Order History</button>
        </div>

        {orders.length > 0 && (
          <div className="orders-list">
            <h3>Last 3 Orders</h3>
            {orders.map(order => (
              <div key={order.id} className="order-item">
                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Total:</strong> KSh {order.total}</p>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>{item.name} x {item.quantity || 1}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
