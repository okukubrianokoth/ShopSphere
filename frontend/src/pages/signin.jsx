import React, { useState, useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "/home/walid/ShopSphere/frontend/src/context/AuthContext.jsx";
import "../styles/login.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); 
    }
  }, [navigate, isAuthenticated]);

  
  const loginInitial = { emailOrUsername: "", password: "" };
  const loginSchema = Yup.object({
    emailOrUsername: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleLogin = async (values) => {
    try {
      const res = await fetch("http://localhost:5555/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        login(data); 
        alert("Login successful!");
        navigate("/");
      } else {
        alert(data.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  const signupInitial = { username: "", email: "", password: "" };
  const signupSchema = Yup.object({
    username: Yup.string().min(3, "Min 3 chars").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 chars").required("Required"),
  });

  const handleSignup = async (values) => {
    try {
      const res = await fetch("http://localhost:5555/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully! Please login.");
        setIsLogin(true);
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      {isLogin ? (
        <Formik
          initialValues={loginInitial}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          <Form className="auth-form">
            <label>
              <User size={18} /> Email or Username
              <Field type="text" name="emailOrUsername" />
              <ErrorMessage name="emailOrUsername" component="div" className="error" />
            </label>

            <label>
              <Lock size={18} /> Password
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </label>

            <button type="submit">Login</button>
          </Form>
        </Formik>
      ) : (
        <Formik
          initialValues={signupInitial}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          <Form className="auth-form">
            <label>
              <User size={18} /> Username
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </label>

            <label>
              <Mail size={18} /> Email
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </label>

            <label>
              <Lock size={18} /> Password
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </label>

            <button type="submit">Signup</button>
          </Form>
        </Formik>
      )}
    </div>
  );
}