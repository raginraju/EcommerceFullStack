import React from 'react';

export default function QRCodeModal({ order, onClose, baseUrl }) {
  if (!order) return null;

  const qrUrl = `${baseUrl}/payment/callback?orderId=${order.orderId}`;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=200x200`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
        <h3 className="text-xl font-bold mb-4">Scan to Pay</h3>
        <a href={qrUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={qrImage}
            alt="QR Code"
            className="mx-auto hover:opacity-80 transition"
          />
        </a>
        <p className="mt-4 text-sm text-gray-600">
          Scan this QR code or click to open the payment link in a new tab.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
