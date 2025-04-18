import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Navbar from '../components/Navbar';
import QRCodeModal from '../components/QRCodeModal';
import ReviewForm from '../components/ReviewForm';



export default function Orders() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('username'); // directly from localStorage

    const [orders, setOrders] = useState([]);
    const [orderItemsMap, setOrderItemsMap] = useState({});
    const [productMap, setProductMap] = useState({});
    const [paymentMap, setPaymentMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [selectedOrderForQR, setSelectedOrderForQR] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [showReviewFormFor, setShowReviewFormFor] = useState(null);
    const [reviewedProductIds, setReviewedProductIds] = useState([]);


    useEffect(() => {
        fetchOrders();
        fetchUserReviews();
    }, []);

    const fetchOrders = async () => {
        const userName = localStorage.getItem('username');
        const isAdmin = userName === 'admin';
    
        try {
            let res;
    
            if (isAdmin) {
                res = await axios.get(`http://localhost:8080/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
                // Sort: PENDING first
                res.data.sort((a, b) => {
                    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                    if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
                    return 0;
                });
            } else {
                res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
    
            const allOrders = res.data;
            setOrders(allOrders);
    
            const itemsMap = {};
            const paymentMapTemp = {};
            const productsToFetch = new Set();
    
            await Promise.all(
                allOrders.map(async (order) => {
                    const [itemRes, paymentRes] = await Promise.all([
                        axios.get(`http://localhost:8080/api/order_items/order/${order.orderId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get(`http://localhost:8080/api/payments/order/${order.orderId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                    ]);
    
                    itemsMap[order.orderId] = itemRes.data;
    
                    const paymentArr = paymentRes.data;
                    paymentMapTemp[order.orderId] = Array.isArray(paymentArr) ? paymentArr[0] : null;
    
                    itemRes.data.forEach(item => productsToFetch.add(item.productId));
                })
            );
    
            const productData = {};
            await Promise.all(
                [...productsToFetch].map(async (productId) => {
                    try {
                        const productRes = await axios.get(`http://localhost:8080/api/products/${productId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        productData[productId] = productRes.data;
                    } catch (err) {
                        console.error(`Error fetching product ${productId}`);
                    }
                })
            );
    
            setOrderItemsMap(itemsMap);
            setProductMap(productData);
            setPaymentMap(paymentMapTemp);
    
            // ✅ Step: Fetch user reviews and auto-expand if any item is reviewable
            if (!isAdmin) {
                const reviewsRes = await axios.get(`http://localhost:8080/api/reviews/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const reviewedProductIds = reviewsRes.data.map(r => r.productId);
    
                const autoExpandOrderIds = [];
    
                allOrders.forEach(order => {
                    const items = itemsMap[order.orderId];
                    const hasReviewableItem = items?.some(item =>
                        !reviewedProductIds.includes(item.productId)
                    );
    
                    if (hasReviewableItem && order.status === 'DELIVERED') {
                        autoExpandOrderIds.push(order.orderId);
                    }
                });
    
                setExpandedOrders(autoExpandOrderIds);
            }
    
        } catch (err) {
            console.error('Failed to fetch orders or items:', err);
        } finally {
            setLoading(false);
        }
    };
    


    const toggleExpand = (orderId) => {
        setExpandedOrders(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleDownloadInvoicePDF = (order) => {
        const items = orderItemsMap[order.orderId] || [];
        const doc = new jsPDF();

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('TechShop', 105, 20, null, null, 'center');

        doc.setFontSize(16);
        doc.text('INVOICE', 105, 30, null, null, 'center');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Order ID: ${order.orderId}`, 14, 45);
        doc.text(`Status: ${order.status}`, 14, 52);
        doc.text(`Shipping Address: ${order.shippingAddr}`, 14, 59);

        const tableBody = items.map(item => {
            const product = productMap[item.productId];
            return [
                product?.name || `Product #${item.productId}`,
                item.quantity,
                `$${item.priceAtPurchase}`,
                `$${(item.quantity * item.priceAtPurchase).toFixed(2)}`
            ];
        });

        autoTable(doc, {
            startY: 70,
            head: [['Product', 'Quantity', 'Price', 'Total']],
            body: tableBody
        });

        doc.setFont('helvetica', 'bold');
        doc.text(`Total: $${order.totalPrice.toFixed(2)}`, 140, doc.lastAutoTable.finalY + 17);
        doc.save(`Invoice_Order_${order.orderId}.pdf`);
    };

    const handleGenerateQR = (order) => {
        setSelectedOrderForQR(order);
        setShowQRModal(true);
    };

    const handleMarkAsShipped = async (orderId) => {
        try {
            const res = await axios.put(
                `http://localhost:8080/api/orders/${orderId}/status?status=SHIPPED`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`✅ Order #${orderId} marked as SHIPPED`);
            fetchOrders(); // Refresh the orders list
        } catch (err) {
            console.error('Failed to update order status:', err);
            alert('❌ Failed to update status');
        }
    };

    const handleMarkDelivered = async (orderId) => {
        try {
            await axios.put(`http://localhost:8080/api/orders/${orderId}/status?status=DELIVERED`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`✅ Order #${orderId} marked as DELIVERED`);
            fetchOrders(); // Refresh the orders list
        } catch (err) {
            console.error(`Failed to mark order #${orderId} as delivered`, err);
            alert('❌ Failed to update status.');
        }
    };

    const handleSubmitReview = async () => {
        try {
            await axios.post(`http://localhost:8080/api/reviews`, {
                userId: userId,
                productId: reviewData.productId,
                rating: reviewData.rating,
                comment: reviewData.comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('✅ Review submitted successfully!');
            setShowReviewFormFor(null); // Close the form
            setReviewData({ productId: '', rating: '', comment: '' });
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('❌ Failed to submit review.');
        }
    };

    const fetchUserReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/reviews/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // extract reviewed productIds
            const reviewedIds = res.data.map(review => review.productId);
            setReviewedProductIds(reviewedIds);
        } catch (err) {
            console.error('Failed to fetch user reviews:', err);
        }
    };


    const filteredOrders = orders.filter(order =>
        filter === 'ALL' ? true : order.status === filter
    );

    return (
        <div className="pt-20 min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold text-center mb-6">
                    {userName === 'admin' ? '📦 Process Orders' : '📦 My Orders'}
                </h2>

                <div className="flex justify-center mb-6 gap-3">
                    {['ALL', 'PENDING', 'SHIPPED', 'DELIVERED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded font-medium ${filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading orders...</p>
                ) : filteredOrders.length === 0 ? (
                    <p className="text-center text-gray-600">No orders found.</p>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map(order => {
                            const payment = paymentMap[order.orderId];
                            return (
                                <div key={order.orderId} className="bg-white shadow rounded-lg">
                                    <div className="p-6 flex justify-between items-start flex-wrap gap-4">
                                        <div>
                                            <p className="font-semibold text-lg">Order #{order.orderId}</p>
                                            <p className="text-sm text-gray-600">Status: <span className="font-medium">{order.status}</span></p>
                                            <p className="text-sm text-gray-600">Shipping Address: {order.shippingAddr}</p>
                                            <p className="text-sm text-gray-600">Total: <span className="text-blue-600 font-bold">${order.totalPrice.toFixed(2)}</span></p>
                                            <p className="text-sm text-gray-600">Payment Status: <span className="font-medium">{payment?.status || 'UNPAID'}</span></p>
                                            {payment?.paidAt && (
                                                <p className="text-sm text-gray-500">
                                                    Paid On: {new Date(payment.paidAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                            <button
                                                onClick={() => toggleExpand(order.orderId)}
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {expandedOrders.includes(order.orderId) ? 'Hide Items' : 'Show Items'}
                                            </button>
                                            <button
                                                onClick={() => handleDownloadInvoicePDF(order)}
                                                className="text-sm text-green-600 hover:underline"
                                            >
                                                📄 Download Invoice
                                            </button>
                                            {userName !== 'admin' && !paymentMap[order.orderId]?.status && (
                                                <button
                                                    onClick={() => handleGenerateQR(order)}
                                                    className="text-sm text-purple-600 hover:underline"
                                                >
                                                    💳 Pay
                                                </button>
                                            )}
                                            {userName === 'admin' &&
                                                paymentMap[order.orderId]?.status === 'PAID' &&
                                                order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && (
                                                    <button
                                                        onClick={() => handleMarkAsShipped(order.orderId)}
                                                        className="text-sm text-orange-600 hover:underline"
                                                    >
                                                        📦 Mark as Shipped
                                                    </button>
                                                )}
                                            {userName !== 'admin' && order.status === 'SHIPPED' && (
                                                <button
                                                    onClick={() => handleMarkDelivered(order.orderId)}
                                                    className="text-sm text-indigo-600 hover:underline"
                                                >
                                                    📬 Mark as Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {expandedOrders.includes(order.orderId) && (
                                        <div className="px-6 pb-6">
                                            <h4 className="font-semibold text-gray-800 mb-3">🛒 Items in this order:</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {orderItemsMap[order.orderId]?.map(item => {
                                                    const product = productMap[item.productId];

                                                    return (
                                                        <div
                                                            key={item.orderItemId}
                                                            className="flex flex-col gap-2 bg-gray-100 rounded p-3"
                                                        >
                                                            <div className="flex gap-3 items-center">
                                                                <img
                                                                    src={`/assets/${product.category?.toLowerCase() || 'default'}.png`}
                                                                    alt={product.name || 'Product Image'}
                                                                    className="w-14 h-14 object-cover rounded"
                                                                />
                                                                <div>
                                                                    <p className="font-semibold">{product?.name || 'Product Name'}</p>
                                                                    <p className="text-sm text-gray-600">{product?.description || 'Product Description'}</p>
                                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                                    <p className="text-sm text-gray-600">Price at purchase: ${item.priceAtPurchase}</p>
                                                                </div>
                                                            </div>

                                                            {/* ✅ Review Button for Delivered Orders */}
                                                            {userName !== 'admin' && order.status === 'DELIVERED' && (
                                                                <div className="pl-3">
                                                                    {reviewedProductIds.includes(item.productId) ? (
                                                                        <p className="text-sm text-gray-500">✅ You have already reviewed this product.</p>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                onClick={() => setShowReviewFormFor(item.orderItemId)}
                                                                                className="text-sm text-yellow-600 hover:underline"
                                                                            >
                                                                                ✍️ Add Review
                                                                            </button>

                                                                            {showReviewFormFor === item.orderItemId && (
                                                                                <ReviewForm
                                                                                    userId={userId}
                                                                                    productId={item.productId}
                                                                                    token={token}
                                                                                    onSuccess={() => {
                                                                                        // ✅ Hide form and update reviewed list
                                                                                        setShowReviewFormFor(null);
                                                                                        setReviewedProductIds(prev => [...prev, item.productId]);
                                                                                    }}
                                                                                    onCancel={() => setShowReviewFormFor(null)}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}

                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ✅ QR Modal */}
            <QRCodeModal
                order={selectedOrderForQR}
                onClose={() => {
                    setShowQRModal(false);
                    setSelectedOrderForQR(null);
                }}
                baseUrl={'http://localhost:5173'}
            />

        </div>
    );
}
