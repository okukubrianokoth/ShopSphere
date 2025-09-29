import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import "../styles/Footer.css";   // ✅ fixed path

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3>ShopSphere</h3>
          <p>Shop Smart, Live Better</p>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p><Mail size={16} /> <a href="mailto:contact@shopsphere.example">contact@shopsphere.example</a></p>
          <p><Phone size={16} /> <a href="tel:+1234567890">+1 234 567 890</a></p>
          <p><MapPin size={16} /> 123 Blue Street, Nairobi, Kenya</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <p className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={18} /></a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}
