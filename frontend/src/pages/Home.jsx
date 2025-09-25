import React from "react";
import { Info, Box, Star, Truck, CreditCard, Smile } from "lucide-react";
import Footer from "../components/Footer"; 
import "../styles/home.css";

export default function Home() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Welcome to ShopSphere</h1>
        <p>Your one-stop shop for everything smart and convenient!</p>
        <button className="shop-now" onClick={() => window.location.href = "/products"}>Shop Now</button>
      </header>

      <section className="company-info">
        <h2>About Us</h2>
        <div className="info-cards">
          <div className="card">
            <Info size={24} />
            <h3>Year Established</h3>
            <p>2023</p>
          </div>
          <div className="card">
            <Star size={24} />
            <h3>Motto</h3>
            <p>Shop Smart, Live Better</p>
          </div>
          <div className="card">
            <Box size={24} />
            <h3>Products Sold</h3>
            <p>1000+</p>
          </div>
          <div className="card">
            <Box size={24} />
            <h3>Available Products</h3>
            <p>150+</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why ShopSphere?</h2>
        <div className="features-cards">
          <div className="feature-card">
            <Truck size={32} />
            <h3>Fast Delivery</h3>
            <p>Get your products delivered quickly and safely.</p>
          </div>
          <div className="feature-card">
            <CreditCard size={32} />
            <h3>Secure Payments</h3>
            <p>All transactions are encrypted and secure.</p>
          </div>
          <div className="feature-card">
            <Smile size={32} />
            <h3>Customer Satisfaction</h3>
            <p>Our top priority is keeping our customers happy.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>“Great service, fast delivery, and excellent products!”</p>
            <strong>- Alice K.</strong>
          </div>
          <div className="testimonial-card">
            <p>“ShopSphere makes online shopping so easy and reliable.”</p>
            <strong>- James W.</strong>
          </div>
          <div className="testimonial-card">
            <p>“Love the variety and quality of products. Highly recommended!”</p>
            <strong>- Maria P.</strong>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
