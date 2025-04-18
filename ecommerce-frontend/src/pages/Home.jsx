import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const userName = localStorage.getItem('username');
  const isAdmin = userName === 'admin';
  const token = localStorage.getItem('token');



  const categories = [
    'All',
    'Phone',
    'TV',
    'Laptop',
    'Tablet',
    'Smartwatch',
    'Camera',
    'Headphone'
  ];

  const fetchAllProducts = () => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8080/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (searchTerm.trim() === '') {
      fetchAllProducts();
      return;
    }
    axios.get(`http://localhost:8080/api/products/search_name/${searchTerm}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Search failed:', err));
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    const token = localStorage.getItem('token');

    if (category === 'All') {
      fetchAllProducts();
      return;
    }

    axios.get(`http://localhost:8080/api/products/search_category/${category.toLowerCase()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Category filter failed:', err));
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8080/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Product deleted successfully!');
      // Refresh products after deletion
      setProducts(prev => prev.filter(p => p.productId !== productId));
    } catch (err) {
      console.error('❌ Failed to delete product:', err);
      alert('❌ Failed to delete product.');
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100" >
      {/* 🔷 NavBar */}
      <Navbar />
      {/* 🔍 Search Bar */}
      <div className="max-w-3xl mx-auto mt-10 px-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* 🔽 Category Filter */}
        <div className="flex flex-wrap justify-center mt-6 gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm transition ${selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 🔷 Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-8">🛍️ Products</h2>

        {products.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link
                to={`/products/${product.productId}`}
                key={product.productId}
                className="block bg-white shadow rounded overflow-hidden hover:shadow-lg transition"
              >
                <img
                    src={`/assets/${product.category?.toLowerCase() || 'default'}.png`}
                    alt={product.name || 'Product Image'}
                    className="w-full h-58 object-contain bg-white"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <p className="text-blue-600 font-bold text-lg">${product.price.toFixed(2)}</p>
                </div>
                {isAdmin && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="text-red-600 hover:text-red-800 text-lg font-semibold flex items-center gap-1"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}


              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
