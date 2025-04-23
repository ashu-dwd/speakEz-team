import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/favicon.jpg";
import "./Navbar.css";
import { auth } from "../Firebase";
import { useAuth } from "../context/authContext";

<<<<<<< HEAD
const Navbar = ({isAdmin}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
=======
const Navbar = ({ isAdmin }) => {
>>>>>>> 92bc8b0737aed62b06cc6caad2b8d107c66b30d4
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.clear();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
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

      {!isLoggedIn ? (
        <div className="auth-buttons">
          <Link to="/signup" className="btn btn-light">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-dark">
            Login
          </Link>
        </div>
      ) : (
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
      )}
    </nav>
  );
};

export default Navbar;
