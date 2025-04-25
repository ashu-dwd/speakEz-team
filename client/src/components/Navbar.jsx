import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../../public/favicon.png';
import "./Navbar.css";
import { auth } from "../Firebase";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      // Try Firebase signout if available
      try {
        await auth.signOut();
      } catch (e) {
        console.log("Firebase signout not available:", e);
      }
      logout();
    
      // Regardless of Firebase, clear all local storage tokens
      localStorage.removeItem('token');
      localStorage.removeItem('authState');
      localStorage.removeItem("user");
      
    
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderAuthButtons = () => {
    if (!isLoggedIn) {
      return (
        <div className="auth-buttons">
          <Link to="/signup" className="btn btn-light">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-dark">
            Login
          </Link>
        </div>
      );
    } else {
      return (
        <div className="dropdown" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="dropdown-toggle"
          >
            {user.displayName || "Account"} ▾
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <p className="dropdown-item">
                Signed in as <strong>{user.displayName || user.email}</strong>
              </p>
              <Link to="/dashboard" className="dropdown-item">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="dropdown-item">
                Logout
              </button>
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
        {[{ path: "/", label: "Home" },
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
        
        {/* Render admin link if the user is an admin */}
        {user?.role === 'admin' && (
          <li>
            <Link to="/aicharacter" className="nav-link">
              Create AI Character
            </Link>
          </li>
        )}
      </ul>
      
      {renderAuthButtons()}
    </nav>
  );
};

export default Navbar;
