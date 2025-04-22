import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './verifyotp.css';

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [otpSent, setOtpSent] = useState(false);

  const { email, password, name } = location.state || {};

  useEffect(() => {
    const sendOtp = async () => {
      if (email) {
        const response = await fetch("http://localhost:5000/api/user/gen-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await response.json();
        if (data.success) {
          setOtpSent(true);
        } else {
          alert(data.error);
          navigate("/signup");
        }
      }
    };
    sendOtp();
  }, [email, password, name, navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const payload = { email, otp, password, name };
    console.log("Sending payload:", payload);

    const response = await fetch("http://localhost:5000/api/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Response:", data);
    if (data.success) {
      alert("✅ OTP Verified Successfully!");
      navigate("/login");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="otp-container"> 
    <form onSubmit={handleVerifyOtp} className="otp-form" >
      <h2 className="otp-title">Verify OTP</h2>
      {otpSent ? (
        <>
          {" "}
          <p className="otp-info">OTP sent to {email}</p>
          <input 
          className="otp-input"
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify</button>
        </>
      ) : (
        <>
          <p className="otp-loading">Sending OTP to {email}...</p>
        </>
      )}
    </form>
    </div>
  );
};

export default Verifyotp;
