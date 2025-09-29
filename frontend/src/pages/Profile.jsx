import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/home/brian-okuku/Documents/ShopSphere/frontend/src/styles/profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    return parsedData.user || parsedData;
  };

  const getToken = () => {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    
    const parsedData = JSON.parse(userData);
    return parsedData.access_token;
  };

  // Check if user is logged in, redirect if not
  useEffect(() => {
    const currentUser = getCurrentUser();
    const token = getToken();
    
    if (!currentUser || !token) {
      navigate("/auth");
      return;
    }
    
    setUser(currentUser);
    setUpdatedUser(currentUser);
  }, [navigate]);

  // Fetch current user profile from backend
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile with token:", token.substring(0, 20) + "...");
        
        const res = await fetch("http://localhost:5555/api/users/me", {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("Profile response status:", res.status);
        
        if (!res.ok) {
          throw new Error(``);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }
        
        const data = await res.json();
        console.log("Profile data received:", data);
        
        setUser(data);
        setUpdatedUser(data);
        setError(null);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile: " + err.message);
        // Don't redirect here, use cached user data
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Fetch last 3 completed orders for this user
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        
        const res = await fetch("http://localhost:5555/api/orders/?limit=3", {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        console.log("Orders response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response for orders");
        }
        
        const data = await res.json();
        console.log("Orders data received:", data);
        
        setOrders(data);
      } catch (err) {
        console.error("Orders fetch error:", err);
        // Don't show error for orders, just log it
        setOrders([]); // Set empty array so UI shows "No orders"
      }
    };
    
    fetchOrders();
  }, []);

  const updateAccount = async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:5555/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setUpdatedUser(data);
        setEditing(false);
        alert("Account updated successfully!");
      } else {
        const errorText = await res.text();
        console.error("Update error:", errorText);
        alert("Failed to update account.");
      }
    } catch (err) {
      console.error("Update account error:", err);
      alert("Error updating account: " + err.message);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-page">
      <h2>Hi, {user.username}</h2>
      
      {error && (
        <div className="error-message" style={{color: 'red', margin: '10px 0'}}>
          {error}
        </div>
      )}

      <div className="profile-actions">
        <button onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Update Account"}
        </button>

        {editing && (
          <div className="update-form">
            <input
              type="text"
              value={updatedUser.username || ""}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, username: e.target.value })
              }
              placeholder="Username"
            />
            <input
              type="email"
              value={updatedUser.email || ""}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, email: e.target.value })
              }
              placeholder="Email"
            />
            <button onClick={updateAccount}>Save</button>
          </div>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="orders-list">
          <h3>Last 3 Orders</h3>
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Total:</strong> KSh {order.total_price?.toFixed(2) || '0.00'}
              </p>
              <ul>
                {order.items?.map((item) => (
                  <li key={item.id}>
                    {item.product?.name || 'Unknown Product'} x {item.quantity}
                  </li>
                )) || <li>No items</li>}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No completed orders yet.</p>
      )}
    </div>
  );
}