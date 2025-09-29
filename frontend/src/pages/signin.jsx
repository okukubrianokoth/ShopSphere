import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";   // ✅ fixed path
import "../styles/login.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSignup = async (values, { resetForm }) => {
    try {
      const res = await fetch("http://localhost:5555/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully! Please login.");
        resetForm(); 
        setIsLogin(true); 
        setShowPassword(false);
      } else {
        alert(data.error || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  };

  const PasswordField = ({ name, placeholder = "Password" }) => (
    <Field name={name}>
      {({ field }) => (
        <div style={{ position: 'relative' }}>
          <input
            {...field}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            style={{ paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      )}
    </Field>
  );

  return (
    <div className="auth-page">
      <div className="tabs">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => {
            setIsLogin(true);
            setShowPassword(false);
          }}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => {
            setIsLogin(false);
            setShowPassword(false);
          }}
        >
          Signup
        </button>
      </div>

      {isLogin ? (
        <Formik
          key="login"
          initialValues={loginInitial}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          <Form className="auth-form">
            <label>
              <User size={18} /> Email or Username
              <Field 
                type="text" 
                name="emailOrUsername" 
                autoComplete="username" 
              />
              <ErrorMessage name="emailOrUsername" component="div" className="error" />
            </label>

            <label>
              <Lock size={18} /> Password
              <PasswordField name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </label>

            <button type="submit">Login</button>
          </Form>
        </Formik>
      ) : (
        <Formik
          key="signup"
          initialValues={signupInitial}
          validationSchema={signupSchema}
          onSubmit={handleSignup}
        >
          <Form className="auth-form">
            <label>
              <User size={18} /> Username
              <Field type="text" name="username" autoComplete="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </label>

            <label>
              <Mail size={18} /> Email
              <Field type="email" name="email" autoComplete="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </label>

            <label>
              <Lock size={18} /> Password
              <PasswordField name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </label>

            <button type="submit">Signup</button>
          </Form>
        </Formik>
      )}
    </div>
  );
}
