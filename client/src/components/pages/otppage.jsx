import React, { useState, useEffect } from "react";
import "./otpPage.css";
import { useLocation, useNavigate } from "react-router-dom";

const Otppage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const name = location.state?.name;
  const password = location.state?.password;
  const [otpSent, setOtpSent] = useState(false);

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

  useEffect(() => {
    if (otpSent) {
      navigate("/verify-otp", {
        state: { email, password, name },
      });
    }
  }, [otpSent, navigate, email, password, name]);

  if (!email) return <p>Email not found. Please sign up again.</p>;

  return (
    <div className="otp-container">
      <div className="otp-card">
        <p>Sending OTP...</p>
      </div>
    </div>
  );
};

export default Otppage;
