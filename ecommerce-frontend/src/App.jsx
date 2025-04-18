import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import UserPage from './pages/UserPage';
import PaymentCallback from './pages/PaymentCallback';
import CreateProduct from './pages/CreateProduct';
import AdminAnalytics from './pages/AdminAnalytics';


const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
      </Routes>
    </Router>
  );
};

export default App;
