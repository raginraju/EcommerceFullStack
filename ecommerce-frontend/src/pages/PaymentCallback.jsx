import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Processing payment...');
  const orderId = params.get('orderId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!orderId || !token) {
      setStatusMessage('❌ Invalid session or order ID.');
      return;
    }

    const makePayment = async () => {
      try {
        // Step 1: Fetch order
        const orderRes = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const totalAmount = orderRes.data.totalPrice;

        // Step 2: Create payment
        await axios.post(
          'http://localhost:8080/api/payments',
          {
            orderId,
            paymentMethod: 'PAYNOW',
            amount: String(totalAmount),
            status: 'PAID',
            paidAt: new Date().toISOString()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Step 3: Fetch order items
        const orderItemsRes = await axios.get(`http://localhost:8080/api/order_items/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const orderItems = orderItemsRes.data;

        // Step 4: For each item, reduce stock and update
        for (const item of orderItems) {
          // Get product details
          const productRes = await axios.get(`http://localhost:8080/api/products/${item.productId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const product = productRes.data;
          const updatedStock = product.stockQuantity - item.quantity;

          // Update product stock
          await axios.put(`http://localhost:8080/api/products/${item.productId}`, {
            ...product,
            stockQuantity: updatedStock
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        // Step 5: Done!
        setStatusMessage('✅ Payment successful! You may close this window and return to the merchant site.');
      } catch (err) {
        console.error('❌ Payment failed:', err);
        setStatusMessage('❌ Payment failed. Please try again or contact support.');
      }
    };

    makePayment();
  }, [orderId, token]);

  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-center text-xl font-semibold text-blue-700 px-6">
      {statusMessage}

      {/* 👇 Optional Return Link */}
      {statusMessage.startsWith('✅') && (
        <a
          href="http://localhost:5173/orders"
          className="mt-4 inline-block text-blue-600 underline text-sm hover:text-blue-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          🔁 Go to merchant site
        </a>
      )}
    </div>
  );
}
