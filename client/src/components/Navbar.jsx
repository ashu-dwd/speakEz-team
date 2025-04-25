import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/favicon.png";
import "./Navbar.css";
import { auth } from "../Firebase";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user, setUser, isAdmin } = useContext(AuthContext); // isAdmin assumed from context

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token");
      const authState = localStorage.getItem("authState");
      setIsAuthenticated(!!token || authState === "true");
    };

    checkAuthStatus();
    const intervalId = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("token");
      localStorage.setItem("authState", "false");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

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
    }

    return (
      <div className="dropdown" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="dropdown-toggle"
        >
          {user?.displayName || "Account"} ▾
        </button>
        {showDropdown && (
          <div className="dropdown-menu">
            <p className="dropdown-item">
              Signed in as <strong>{user?.name || user?.email}</strong>
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
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Logo" />
      </Link>

      <ul className="navbar-nav">
        {[
          { path: "/", label: "Home" },
          { path: "/about", label: "About" },
          { path: "/contact", label: "Contact" },
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

      <div className="auth-buttons">{renderAuthButtons()}</div>
    </nav>
  );
};

export default Navbar;
