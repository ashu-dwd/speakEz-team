import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Logo" />
      </Link>

      <ul className="navbar-nav">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/contact" className="nav-link">Contact</Link>
        </li>
        <li>
          <Link to="/about" className="nav-link">About </Link>
        </li>
        <li>
          <Link to="/help" className="nav-link">Help Desk</Link>
        </li>
        <li>
          <Link to="/practicewithai" className="nav-link"> Practice with  AI </Link>
        </li>
      </ul>

      <div className="auth-buttons">
        <Link to="/login" className="btn btn-light">Log in</Link>

        <Link to="/signup" className="btn btn-dark">Sign up free</Link>
      </div>
    </nav>
  );
};

export default Navbar;
