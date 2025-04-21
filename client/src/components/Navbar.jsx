import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/favicon.jpg";
import "./Navbar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth } from "../Firebase";

const Navbar = ({isAdmin}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Logo" />
      </Link>

      <ul className="navbar-nav">
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/vocabulary" className="nav-link">
            {" "}
            Vocabulary
          </Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">
            About{" "}
          </Link>
        </li>
        <li>
          <Link to="/help" className="nav-link">
            Help Desk
          </Link>
        </li>
        <li>
          <Link to="/practicewithai" className="nav-link">
            {" "}
            Practice with AI{" "}
          </Link>
        </li>

        {isAdmin && (
          <li>
            {" "}
            <Link to="/aicharacter">Create AI Character </Link>
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
            onClick={() => setShowDropdown(!showDropdown)}
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
