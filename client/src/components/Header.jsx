import React from "react";
import "../assets/Header.css";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, BookOpen, Users } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, number: "10K+", label: "Learners" },
    { icon: BookOpen, number: "50+", label: "Lessons" },
    { icon: Play, number: "24/7", label: "Support" },
  ];

  return (
    <header className="custom-header">
      <div className="header-overlay">
        <div className="header-content">
          <div className="header-left">
            <div className="header-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <stat.icon className="stat-icon" />
                  <span className="stat-text">
                    <strong>{stat.number}</strong> {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <h1 className="header-text">Smart Learning for a Smarter You</h1>
            <p className="header-subtext">
              Dive into an interactive learning experience built for the digital
              age. Flexible, engaging, and designed to help you grow—anytime,
              anywhere.
            </p>
            <div className="header-buttons">
              <button
                className="header-button primary"
                onClick={() => navigate("/Morecourse")}
              >
                Get Started
                <ArrowRight size={20} />
              </button>
              <button
                className="header-button secondary"
                onClick={() => navigate("/practicewithai")}
              >
                Try AI Practice
              </button>
            </div>
          </div>
          <div className="header-right">
            {/* Optional: Add an illustration or 3D element here later */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
