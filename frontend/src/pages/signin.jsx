import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/login.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Login form
  const loginInitial = { emailOrUsername: "", password: "" };
  const loginSchema = Yup.object({
    emailOrUsername: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });
  const handleLogin = async (values) => {
    try {
      const res = await fetch(`http://localhost:5555/api/users/login?identifier=${values.emailOrUsername}&password=${values.password}`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        alert("Login successful!");
      } else {
        alert("Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  // Signup form
  const signupInitial = { username: "", email: "", password: "" };
  const signupSchema = Yup.object({
    username: Yup.string().min(3, "Min 3 chars").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Min 6 chars").required("Required"),
  });
  const handleSignup = async (values) => {
    try {
      const res = await fetch("http://localhost:5555/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        alert("Account created successfully!");
        setIsLogin(true);
      } else {
        alert("Signup failed. Try a different email/username.");
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
