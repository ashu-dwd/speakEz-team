import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [validToken, setValidToken] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // Optional: check token validity from backend
    const verifyToken = async () => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/user/verify-reset-token`,
          { token }
        );
        if (res.data.success) {
          setValidToken(true);
        } else {
          alert("Token expired or invalid");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        alert("Invalid token");
        navigate("/login");
      }
    };
    if (token) verifyToken();
    else navigate("/login");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return alert("Please enter a new password");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/reset-password/${token}`,
        {
          newPassword,
        }
      );

      if (res.data.success) {
        alert(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to reset password");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Set New Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="reset-input"
          required
        />
        <div className="reset-buttons">
          <button type="button" onClick={handleSkip} className="reset-skip">
            Skip New Password
          </button>
          <button type="submit" className="reset-submit">
            Continue to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
