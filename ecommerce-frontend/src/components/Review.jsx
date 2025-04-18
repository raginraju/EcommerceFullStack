import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Review({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`http://localhost:8080/api/reviews/product/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setReviews(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch reviews:', err);
      setLoading(false);
    });
  }, [productId]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">🗣️ Customer Reviews</h3>
      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet for this product.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.reviewId} className="bg-gray-100 p-4 rounded-md shadow-sm">
              <p className="font-semibold text-yellow-600">⭐ Rating: {review.rating}/5</p>
              <p className="text-gray-700 mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-2">User ID: {review.userId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
