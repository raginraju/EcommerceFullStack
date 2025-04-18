import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Cart() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    axios.get(`http://localhost:8080/api/cart/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(async res => {
      const items = res.data;
      setCartItems(items);

      const productMap = {};
      await Promise.all(items.map(async item => {
        try {
          const res = await axios.get(`http://localhost:8080/api/products/${item.productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          productMap[item.productId] = res.data;
        } catch (err) {
          console.error(`Error fetching product ${item.productId}:`, err);
        }
      }));
      setProductDetails(productMap);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch cart:', err);
      setLoading(false);
    });
  };

  const handleCheckboxChange = (cartId) => {
    setSelectedItems(prev =>
      prev.includes(cartId) ? prev.filter(id => id !== cartId) : [...prev, cartId]
    );
  };

  const handleDelete = (cartId) => {
    axios.delete(`http://localhost:8080/api/cart/${cartId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setCartItems(prev => prev.filter(item => item.cartId !== cartId));
      setSelectedItems(prev => prev.filter(id => id !== cartId));
    }).catch(err => console.error(`Failed to delete cart item ${cartId}:`, err));
  };

  const handleClearCart = () => {
    axios.delete(`http://localhost:8080/api/cart/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setCartItems([]);
      setProductDetails({});
      setSelectedItems([]);
    }).catch(err => console.error('Failed to clear cart:', err));
  };

  const handlePlaceOrder = async () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.cartId));
    const totalPrice = selectedCartItems.reduce((sum, item) => {
      const product = productDetails[item.productId];
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    try {
      // 1. Create Order
      const orderRes = await axios.post('http://localhost:8080/api/orders', {
        userId: String(userId),
        totalPrice: String(totalPrice),
        status: 'PENDING',
        shippingAddr: address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orderId = orderRes.data.orderId;

      // 2. Add Order Items
      await Promise.all(selectedCartItems.map(item => {
        const product = productDetails[item.productId];
        return axios.post('http://localhost:8080/api/order_items', {
          orderId: String(orderId),
          productId: String(item.productId),
          quantity: String(item.quantity),
          priceAtPurchase: String(product.price)
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }));

      // 3. Remove Selected Items from Cart
      await Promise.all(selectedCartItems.map(item =>
        axios.delete(`http://localhost:8080/api/cart/${item.cartId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ));

      alert(`✅ Order placed successfully! Order ID: ${orderId}`);
      setShowModal(false);
      setSelectedItems([]);
      fetchCartItems(); // Refresh cart

    } catch (err) {
      console.error('❌ Failed to place order:', err);
      alert('❌ Failed to place order.');
    }
  };


  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-center mb-6">🛒 Your Cart</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
              >
                🧹 Clear Cart
              </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-4">
              {cartItems.map(item => {
                const product = productDetails[item.productId];
                return (
                  <div
                    key={item.cartId}
                    className="border-b pb-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.cartId)}
                        onChange={() => handleCheckboxChange(item.cartId)}
                      />

                      <img
                          src={`/assets/${product.category?.toLowerCase() || 'default'}.png`}
                          alt={product.name || 'Product Image'}
                          className="w-12 h-12 object-contain bg-white rounded"
                      />
                      <div>
                        <p className="font-medium">{product?.name || 'Product Name'}</p>
                        <p className="font-medium">{product?.description || 'Product Description'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.cartId)}
                      className="text-red-600 hover:underline hover:text-red-800 text-sm"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(true)}
                disabled={selectedItems.length === 0}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                🛍️ Place Order
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal for Address */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">📦 Enter Shipping Address</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="4"
              placeholder="Enter address..."
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
