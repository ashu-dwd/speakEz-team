import React from "react";
import "../assets/About.css";
import { Link , useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="about-container">
      <div className="about-card">
        <h2 className="about-title">About Speak Ez</h2>
        <p className="about-description">
          Speak Ez is your personal English learning companion, designed to help
          you master speaking, reading, and listening with ease. Whether you're a
          beginner or looking to polish your fluency, our platform offers
          interactive lessons, real-time feedback, and AI-powered speaking
          practice.
        </p>
        <ul className="about-list">
          <li>🎯 Personalized learning paths tailored to your level</li>
          <li>🧠 Smart speech analysis & correction using AI</li>
          <li>🎤 5-minute daily speech challenges to boost fluency</li>
          <li>📚 Engaging content from beginner to advanced</li>
          <li>🏆 Progress tracking & achievement badges</li>
        </ul>
        <button className="about-button" onClick={() => navigate('/signup')}>Start Learning Now</button>
      </div>

      <div className="stats-section">
        <h3 className="stats-title">Why Choose Speak Ez?</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4 className="stat-number">🌍 1000+</h4>
            <p className="stat-text">Active Users</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-number">📘 2000+</h4>
            <p className="stat-text">Vocabulary Words</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-number">📝 150+</h4>
            <p className="stat-text">Grammar Lessons</p>
          </div>
          <div className="stat-card">
            <h4 className="stat-number">🚀 Our Mission</h4>
            <p className="stat-text">
              To make English learning fun, accessible, and effective for all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
