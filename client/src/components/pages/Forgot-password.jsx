// ForgotPassword.jsx
import axios from "axios";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    console.log("Sending password reset to:", email);
    const response = await axios.post(
      "http://localhost:5000/api/user/forgot-password",
      { email }
    );
    if (response.data.success) {
      alert(response.data.message);
    } else {
      alert(response.data.error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleReset} className="login-form">
        <h2>Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
