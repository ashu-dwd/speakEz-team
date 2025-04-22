import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css"; 

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New password set to:", newPassword);
    alert("Password updated!");
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
