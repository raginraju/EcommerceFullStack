import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Review from '../components/Review';


export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');

    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');



    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8080/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => setProduct(res.data))
            .catch(err => console.error('Failed to fetch product details:', err));
    }, [id]);

    const handleAddToCart = async () => {
        const selectedQty = Number(quantity);

        if (selectedQty > product.stockQuantity) {
            setMessage(`❌ Selected quantity exceeds available stock (${product.stockQuantity})`);
            return;
        }

        const token = localStorage.getItem('token');
        const payload = {
            userId: String(userId),
            productId: String(product.productId),
            quantity: String(quantity)
        };

        try {
            const res = await axios.get(`http://localhost:8080/api/cart/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const existingItem = res.data.find(
                item => item.productId === product.productId
            );

            if (existingItem) {
                const updatedQuantity = Number(existingItem.quantity) + selectedQty;

                if (updatedQuantity > product.stockQuantity) {
                    setMessage(`❌ Total quantity in cart would exceed stock (${product.stockQuantity})`);
                    return;
                }

                await axios.put(`http://localhost:8080/api/cart/${existingItem.cartId}`, {
                    userId: String(userId),
                    productId: String(product.productId),
                    quantity: String(updatedQuantity)
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMessage(`✅ Updated quantity in cart`);
            } else {
                const postRes = await axios.post('http://localhost:8080/api/cart', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setMessage(`✅ Added to cart (Cart ID: ${postRes.data.cartId})`);
            }
        } catch (err) {
            console.error('Add to cart failed:', err);
            setMessage('❌ Failed to add/update cart.');
        }
    };


    if (!product) {
        return <div className="text-center py-10 text-gray-500">Loading product...</div>;
    }

    return (
        <div className="pt-20 min-h-screen bg-gray-100">
            <Navbar />

            <div className="flex justify-center items-center px-4 py-10">
                <div className="max-w-xl w-full bg-white shadow-lg rounded-lg overflow-hidden">

                    <img
                        src={`/assets/${product.category?.toLowerCase() || 'default'}.png`}
                        alt={product.name || 'Product Image'}
                        className="w-full h-90 object-contain bg-white rounded"
                    />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                        <p className="text-gray-700 mb-4">{product.description}</p>
                        <p className="text-blue-600 font-bold text-xl mb-2">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stockQuantity}</p>
                        <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>

                        {/* Quantity Selector */}
                        {username !== 'admin' && (
                        <div className="flex items-center gap-2 mb-4">
                            <label htmlFor="quantity" className="text-sm text-gray-600">Quantity:</label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max={product.stockQuantity}
                                value={quantity}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val <= product.stockQuantity) {
                                        setQuantity(val);
                                        setMessage(''); // Clear message on valid change
                                    } else {
                                        setMessage(`❌ Only ${product.stockQuantity} in stock`);
                                    }
                                }}
                                className="w-16 px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        )}

                        {/* Add to Cart Button */}
                        {username !== 'admin' && (
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                            >
                                Add to Cart
                            </button>
                        )}

                        {/* Message */}
                        {message && <p className="mt-4 text-center text-sm">{message}</p>}

                        {/* Reviews Section */}
                        <Review productId={product.productId} />

                    </div>
                </div>
            </div>
        </div>
    );
}
