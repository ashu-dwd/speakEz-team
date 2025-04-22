import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    console.log("Logging in with:", {
      email,
      password,
      remember,
    });
    // Add your login API call here
    const response =  axios.post("http://localhost:5000/api/user/login", {
      email,
      password,
    });
    console.log("Response:", response.data);
    if (response.data) {
      localStorage.setItem("token", response.data.data);
      localStorage.setItem("authState", true);
      alert("Login successful!");
      Navigate("/dashboard");
    } else {
      alert(response.data.error);
=======
    console.log("Logging in with:", { email, password, remember });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        }
      );

      const { data, message } = response.data;

      if (data) {
        localStorage.setItem("token", data);
        localStorage.setItem("authState", "true");
        alert(message || "Login successful!");
        Navigate("/dashboard");
      } else {
        alert("Unexpected response format.");
      }
    } catch (error) {
      // console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
>>>>>>> 48eb059a84f0673a3a5c89f7df305ea34c9603d6
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
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
          <a href="/forgot-password" className="forgot-password">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="login-button">
          {" "}
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
