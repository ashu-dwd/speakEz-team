import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Verifyotp = ({ email }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate(); // ✅ for redirection

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    if (data.success) {
      alert('✅ OTP Verified Successfully!');
      navigate('/dashboard'); // ✅ redirect to dashboard
    } else {
      alert('❌ Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        required
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button type="submit">Verify</button>
    </form>
  );
};

export default Verifyotp;

