// Newsletter.jsx
import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email.trim() !== '') {
      // For now, just show success — connect to backend later if needed
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <div className="newsletter-container">
      <h2 className="newsletter-title">📬 Join Our Newsletter</h2>
      <p className="newsletter-desc">Get free English tips, speaking exercises, and course updates right in your inbox!</p>
      {submitted ? (
        <p className="success-message">✅ Thank you for subscribing!</p>
      ) : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="newsletter-button">Subscribe</button>
        </form>
      )}
    </div>
  );
};

export default Newsletter;
