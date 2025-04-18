import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function AdminAnalytics() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        productsSold: 0,
        pending: 0,
        shipped: 0,
        delivered: 0
    });

    useEffect(() => {
        if (username === 'admin') {
            fetchAnalytics();
        }
    }, []);

    const fetchAnalytics = async () => {
        try {
            const ordersRes = await axios.get('http://localhost:8080/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const orders = ordersRes.data;
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
            const pending = orders.filter(o => o.status === 'PENDING').length;
            const shipped = orders.filter(o => o.status === 'SHIPPED').length;
            const delivered = orders.filter(o => o.status === 'DELIVERED').length;

            let productsSold = 0;
            await Promise.all(
                orders.map(async order => {
                    const itemsRes = await axios.get(`http://localhost:8080/api/order_items/order/${order.orderId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    productsSold += itemsRes.data.reduce((acc, item) => acc + item.quantity, 0);
                })
            );

            setStats({
                totalOrders,
                totalRevenue,
                productsSold,
                pending,
                shipped,
                delivered
            });
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
        }
    };

    if (username !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 text-lg font-semibold">Unauthorized</p>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold text-center mb-6">📊 Admin Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <StatCard title="🧾 Total Orders" value={stats.totalOrders} />
                    <StatCard title="💰 Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
                    <StatCard title="📦 Products Sold" value={stats.productsSold} />
                    <StatCard title="⏳ Pending Orders" value={stats.pending} />
                    <StatCard title="🚚 Shipped Orders" value={stats.shipped} />
                    <StatCard title="✅ Delivered Orders" value={stats.delivered} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-6 rounded shadow text-center border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-2xl text-blue-700 font-bold">{value}</p>
        </div>
    );
}
