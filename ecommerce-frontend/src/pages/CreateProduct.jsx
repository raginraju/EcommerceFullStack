import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function CreateProduct() {
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    imageUrl: ''
  });

  const [message, setMessage] = useState('');

  const categories = [
    'TV',
    'phone',
    'tablet',
    'smartwatch',
    'camera',
    'laptop',
    'headphone'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Enforce numeric input for price and stockQuantity
    if ((name === 'price' || name === 'stockQuantity') && value !== '') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.description || !formData.price || !formData.stockQuantity || !formData.category) {
      setMessage('⚠️ All fields except image URL are required.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/products', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(`✅ Product created successfully! ID: ${res.data.productId}`);
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        imageUrl: ''
      });
    } catch (err) {
      console.error('❌ Product creation failed:', err);
      setMessage('❌ Failed to create product. Check permissions or server.');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white mt-10 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">🛠️ Create New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            name="price"
            placeholder="Price (e.g., 999.99)"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          {/* ✅ Category Dropdown */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">-- Select Category --</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <input
            name="imageUrl"
            placeholder="Image URL (optional)"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            ➕ Add Product
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-blue-700">{message}</p>
        )}
      </div>
    </div>
  );
}
