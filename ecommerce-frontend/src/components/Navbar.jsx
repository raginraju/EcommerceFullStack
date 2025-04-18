import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* 🔗 Clickable TechShop logo */}
                <Link to="/" className="text-xl font-bold text-blue-700 hover:underline">
                    TechShop
                </Link>

                <div className="flex items-center gap-4">
                    {/* ✅ Show Cart link only if user is NOT admin */}
                    {username !== 'admin' && (
                        <Link
                            to="/cart"
                            className="text-gray-700 hover:text-blue-600 transition font-medium"
                        >
                            🛒 Cart
                        </Link>
                    )}

                    {username === 'admin' && (
                        <Link to="/create-product" className="text-gray-700 hover:text-blue-600">
                            🛠️ Create Product
                        </Link>
                    )}

                    <Link
                        to="/orders"
                        className="text-gray-700 hover:text-blue-600 transition font-medium"
                    >
                        📦 Orders
                    </Link>
                    <Link
                        to="/user"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                        👤 Manage Account
                    </Link>
                </div>
            </div>
        </nav>
    );
}
