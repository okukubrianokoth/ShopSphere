import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Product added successfully!");
        navigate("/products");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add product");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16 pb-16">
      {/* Banner */}
      <div className="w-full max-w-2xl bg-blue-600 text-white text-center py-6 rounded-t-lg shadow-md mb-12">
        <h1 className="text-3xl font-bold">Add a New Product</h1>
        <p className="text-md mt-2">Fill in the details below to add a new product</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl bg-white p-12 rounded-b-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-10">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-5 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-5 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-5 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-5 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="image_url"
            placeholder="Image URL"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-5 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-5 py-5 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-5 rounded hover:bg-blue-600 transition text-xl font-semibold"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
