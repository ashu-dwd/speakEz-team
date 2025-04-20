import React, { useState, useEffect } from 'react';
import VerifyOtp from './Verifyotp';
import './otpPage.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Otppage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const sendOtp = async () => {
      if (email) {
        const response = await fetch('http://localhost:5000/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          setOtpSent(true);
        } else {
          alert('Failed to send OTP');
          navigate('/signup'); // redirect back if failed
        }
      }
    };

    sendOtp();
  }, [email, navigate]);

  if (!email) return <p>Email not found. Please sign up again.</p>;

  return (
    <div className="otp-container">
      <div className="otp-card">
        {otpSent ? <VerifyOtp email={email} onVerified={() => navigate('/dashboard')} /> : <p>Sending OTP...</p>}
      </div>
    </div>
  );
};

export default Otppage;
