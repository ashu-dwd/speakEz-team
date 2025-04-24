import React from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="custom-header">
      <div className="header-overlay">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-text"> Smart Learning for a Smarter You</h1>
            <p className="header-subtext">
              Dive into an interactive learning experience built for the digital
              age. <br />
              Flexible, engaging, and designed to help you grow—anytime,
              anywhere.
            </p>
          </div>
          <div className="header-right">
            <button
              className="header-button"
              onClick={() => navigate("/Morecourse")}
            >
              {" "}
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
