import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseName, price } = location.state || { courseName: 'Course', price: 0 };

  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [timeLeft, setTimeLeft] = useState(6 * 60); // 6 minutes
  const [expired, setExpired] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (selectedMethod === 'upi' || selectedMethod === 'bank') {
      setTimeLeft(6 * 60);
      setExpired(false);
      setPaid(false);
    }
  }, [selectedMethod]);

  useEffect(() => {
    if ((selectedMethod !== 'upi' && selectedMethod !== 'bank') || paid || expired) return;
    if (timeLeft === 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, selectedMethod, paid, expired]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handlePaymentSuccess = () => {
    setPaid(true);
    alert(' Payment marked as successful!');
    navigate('/dashboard');
  };

  return (
    <div className="payment-container">
      <h2>Payment for <span className="course-name">{courseName}</span></h2>
      <p className="price">Amount:<strong>${price}</strong></p>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === 'upi'}
            onChange={() => setSelectedMethod('upi')}
          />
          UPI (PhonePe, Paytm)
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === 'card'}
            onChange={() => setSelectedMethod('card')}
          />
          Card
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === 'bank'}
            onChange={() => setSelectedMethod('bank')}
          />
          Bank Transfer
        </label>
      </div>

      {selectedMethod === 'card' && (
        <form className="card-form">
          <input type="text" placeholder="Card Number" />
          <div className="form-row">
            <input type="text" placeholder="Expiration (MM/YY)" />
            <input type="text" placeholder="CVV" />
          </div>
          <button type="submit">Pay ${price}</button>
        </form>
      )}

      {selectedMethod === 'upi' && (
        <div className="upi-section"> 
          <img
            className="qr-code"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=yourupi@okaxis&pn=SpeakEZ&am=${price}`}
            alt="UPI QR"
          />
          {!expired && !paid && (
            <>
              <p>QR valid for: <strong>{formatTime(timeLeft)}</strong></p>
              <button className="paid-btn" onClick={handlePaymentSuccess}>Mark as Paid</button>
            </>
          )}
          {expired && <p className="expired-msg">❌ QR expired. Refresh to try again.</p>}
          {paid && <p className="paid-msg">✅ Payment successful!</p>}
        </div>
      )}

      {selectedMethod === 'bank' && (
        <div className="bank-section">
          <h3>Bank Transfer Details</h3>
          <p><strong>Account Name:</strong> SpeakEZ Academy</p>
          <p><strong>Account Number:</strong> 123456789012</p>
          <p><strong>IFSC Code:</strong> SBIN0001234</p>
          {!expired && !paid && (
            <>
              <p>Transfer must be done within: <strong>{formatTime(timeLeft)}</strong></p>
              <button className="paid-btn" onClick={handlePaymentSuccess}>Mark as Paid</button>
            </>
          )}
          {expired && <p className="expired-msg">❌ Time expired. Please try again.</p>}
          {paid && <p className="paid-msg">✅ Payment received!</p>}
        </div>
      )}
    </div>
  );
};

export default Payment;

