'use client'; // Add this for App Router

import { useState } from 'react';

export default function SendFormPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    setStatus('Sending...');
    const res = await fetch('/api/send_email', {
      method: 'POST',
      body: JSON.stringify({ toEmail: email }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();
    if (result.success) {
      setStatus('✅ Email sent!');
    } else {
      setStatus('❌ Error: ' + result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4 text-black">Send Form Email</h1>
        <input
          type="email"
          placeholder="Enter recipient's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4 placeholder-gray-400 text-black"
        />
        <button
          onClick={sendEmail}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Email
        </button>
        {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
}
