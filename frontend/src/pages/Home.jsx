import React from "react";
import Navbar from "../components/Navbar";
import { Mail, Info, Box } from "lucide-react";
import "styles/home.css";

export default function Home() {
  return (
    <>
      <Navbar loggedIn={false} />
      <div className="home-page">
        <h1>Welcome to ShopSphere</h1>
        <p><Info size={18} /> <strong>Year Established:</strong> 2023</p>
        <p><Box size={18} /> <strong>Motto:</strong> “Shop Smart, Live Better”</p>
        <p><Box size={18} /> <strong>Products Sold:</strong> 1000+</p>
        <p><Box size={18} /> <strong>Available Products:</strong> 150+</p>

        <footer className="home-footer">
          <p><Mail size={16} /> <a href="mailto:contact@shopsphere.example">contact@shopsphere.example</a></p>
          <p>© 2025 ShopSphere</p>
        </footer>
      </div>
    </>
  );
}
