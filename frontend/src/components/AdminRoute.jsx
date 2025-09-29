import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user || !user.is_admin) {
    alert("Access denied: Admins only");
    return <Navigate to="/" replace />;
  }

  return children;
}
