import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../public/favicon.png';
import "./Navbar.css";
import { auth } from "../Firebase";
import { useAuth } from '../context/authContext';

const Navbar = ({ isAdmin }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication status on mount and when dependencies change
  useEffect(() => {
    // Direct token check (reliable across refreshes)
    function checkAuthStatus() {
      // Check specifically for the token that appears in your screenshot
      const token = localStorage.getItem('token');
      const authState = localStorage.getItem('authState');
      
      console.log("Token check:", !!token);
      console.log("Auth state check:", authState);
      
      // If either token exists or authState is true, consider user authenticated
      if (token || authState === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
    
    // Initial check
    checkAuthStatus();
    
    // Set up an interval to periodically check auth state
    // This helps with sync issues between components
    const intervalId = setInterval(checkAuthStatus, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const handleLogout = async () => {
    try {
      // Try Firebase signout if available
      try {
        await auth.signOut();
      } catch (e) {
        console.log("Firebase signout not available:", e);
      }
      
      // Regardless of Firebase, clear all local storage tokens
      localStorage.removeItem('token');
      localStorage.removeItem('authState');
      localStorage.setItem('authState', 'false');
      
      setIsAuthenticated(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Render auth buttons based on determined auth state
  const renderAuthButtons = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link to="/signup" className="btn btn-light">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-dark">
            Login
          </Link>
        </>
      );
    } else {
      return (
        <div className="dropdown">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="dropdown-toggle"
          >
            Account ▾
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      );
    }
  };
  
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Logo" />
      </Link>
      
      <ul className="navbar-nav">
        {[
          { path: "/", label: "Home" },
          { path: "/vocabulary", label: "Vocabulary" },
          { path: "/about", label: "About" },
          { path: "/help", label: "Help Desk" },
          { path: "/practicewithai", label: "Practice with AI" },
        ].map(({ path, label }) => (
          <li key={path}>
            <Link to={path} className="nav-link">
              {label}
            </Link>
          </li>
        ))}
        
        {isAdmin && (
          <li>
            <Link to="/aicharacter" className="nav-link">
              Create AI Character
            </Link>
          </li>
        )}
      </ul>
      
      <div className="auth-buttons">
        {renderAuthButtons()}
      </div>
    </nav>
  );
};

export default Navbar;