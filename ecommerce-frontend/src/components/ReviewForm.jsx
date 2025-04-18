// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

export default function ReviewForm({ userId, productId, token, onSuccess, onCancel }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !comment) return alert('Please fill all fields');
    setLoading(true);

    try {
      await axios.post(`http://localhost:8080/api/reviews`, {
        userId,
        productId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Review submitted!');
      onSuccess();
    } catch (err) {
      console.error('❌ Failed to submit review:', err);
      alert('❌ Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 mt-2 bg-white p-3 rounded shadow space-y-2">
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        placeholder="Rating (1–5)"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        rows="2"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
}
