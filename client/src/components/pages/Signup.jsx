import React, { useState } from "react";
import "./Signup.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    navigate("/verify-otp", {
      state: {
        email: form.email,
        name: form.name,
        password: form.password,
      },
    });
  };

  const handleGoogleSignup = () => {
    if (isLoading) return;
    setIsLoading(true);

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        if (err.code !== "auth/cancelled-popup-request") {
          setError(err.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="signup-input"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="signup-input"
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="signup-button">
          Create Account
        </button>

        <div className="or-divider">OR</div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "8px" }} />
          {isLoading ? "Loading..." : "Continue with Google"}
        </button>

        <p className="signup-login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
