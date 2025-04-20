import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', {
      email,
      password,
      remember,
    });
    // Add your login API call here
    const response = axios.post('/api/user/login', {
      email, password 
    });
    console.log('Response:', response.data);
    if(response.data){
      localStorage.setItem('token', response.data);
      localStorage.setItem('authState', true);
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
          <a href="/forgot-password"  className="forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
