import React, { useState, useEffect, useContext } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { setUser, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Auto-fill remembered email and redirect if already logged in
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const token = localStorage.getItem("token");

    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }

    if (token) {
      navigate("/dashboard"); // redirect if token is present
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API_URL}/api/user/login`,
        {
          email,
          password,
        }
      );

      const { data, message, success, user } = response.data;

      if (success && data) {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", data);
        localStorage.setItem("authState", "true");

        if (remember) {
          localStorage.setItem("rememberEmail", email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        toast.success(message || "Login successful!",{
          duration: 3000,
          position: "top-center",
          style: {
            background: "black",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "16px",
          },
        });
        navigate("/dashboard");
      } else {
        toast.error(message || "Login failed. Please try again.",{
          duration: 3000,
          position: "top-center",
          style: {
            background: "white",
            color: "black",
            borderRadius: "10px",
            padding: "10px",
            fontSize: "16px",
          },
        });
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";
      alert(errMsg);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <form onSubmit={handleSubmit} className="login-form mt-20">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />

        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-password">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
